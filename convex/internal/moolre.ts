import { v } from "convex/values";
import { internalAction } from "../_generated/server";
import { internal } from "../_generated/api";

interface MoolreStatusData {
  txstatus: number | string;
  amount: string;
  transactionid: string;
  externalref: string;
  [key: string]: unknown;
}

interface MoolreStatusResponse {
  status: number | string;
  code: string;
  message: string | null;
  // On success this is an object; on validation/auth errors Moolre returns
  // a string naming the bad field (e.g. "idtype") or an array — never trust
  // its shape without checking first.
  data?: unknown;
}

function isStatusData(data: unknown): data is MoolreStatusData {
  return (
    typeof data === "object" &&
    data !== null &&
    !Array.isArray(data) &&
    "txstatus" in data
  );
}


export const verifyAndConfirmPayment = internalAction({
  args: { externalref: v.string() },
  handler: async (ctx, args) => {
    const apiUser = process.env.MOOLRE_API_USER;
    const pubKey = process.env.MOOLRE_API_PUBKEY;
    const accountNumber = process.env.MOOLRE_ACCOUNT_NUMBER;

    if (!apiUser || !pubKey || !accountNumber) {
      console.error("[moolre verify] Missing MOOLRE_API_USER / MOOLRE_API_PUBKEY / MOOLRE_ACCOUNT_NUMBER in Convex env");
      return;
    }

    // Defaults to live; set MOOLRE_BASE_URL=https://sandbox.moolre.com to test.
    const baseUrl = process.env.MOOLRE_BASE_URL ?? "https://api.moolre.com";

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    let res: Response;
    try {
      res = await fetch(`${baseUrl}/open/transact/status`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-USER": apiUser,
          "X-API-PUBKEY": pubKey,
        },
        body: JSON.stringify({
          type: 1,
          idtype: "1", // 1 = externalref, 2 = Moolre-generated transaction id
          id: args.externalref,
          accountnumber: accountNumber,
        }),
        signal: controller.signal,
      });
    } catch (err) {
      console.error(`[moolre verify] Request failed for reference="${args.externalref}":`, err instanceof Error ? err.message : err);
      return;
    } finally {
      clearTimeout(timeout);
    }

    let json: MoolreStatusResponse;
    try {
      json = await res.json();
    } catch {
      console.error(`[moolre verify] Non-JSON response checking status for reference="${args.externalref}"`);
      return;
    }

    console.log(`[moolre verify] reference="${args.externalref}" httpStatus=${res.status} code="${json.code}" data=${JSON.stringify(json.data)}`);

    if (!isStatusData(json.data)) {
      // Not a real transaction record — a request/auth error on our side
      // (bad params, misconfigured credentials, etc). We genuinely don't
      // know the payment's real status, so leave the order untouched rather
      // than guessing. A later webhook retry or manual re-check can recover.
      console.error(`[moolre verify] Status check did not return transaction data for reference="${args.externalref}" — leaving order untouched. code="${json.code}" message="${json.message}"`);
      return;
    }

    const data = json.data;
    const isConfirmedSuccess = String(json.status) === "1" && Number(data.txstatus) === 1;

    if (isConfirmedSuccess) {
      const amountPesewas = Math.round(parseFloat(data.amount) * 100);
      await ctx.runMutation(internal.internal.tickets.confirmTicketOrderByReference, {
        providerReference: args.externalref,
        grossAmountPesewas: amountPesewas,
        moolreTxId: data.transactionid,
      });
      return;
    }

    // A real transaction record exists but txstatus is a terminal non-1
    // value — only now do we treat it as an actual payment failure.
    await ctx.runMutation(internal.internal.tickets.failTicketOrderByReference, {
      providerReference: args.externalref,
      reason: json.message ?? "Payment not successful",
    });
  },
});

const MINUTE = 60 * 1000;

/**
 * Safety net for missed/delayed webhook deliveries — never rely on a
 * webhook alone for something as important as payment confirmation. Run
 * periodically (see crons.ts) to re-check any Moolre ticket order still
 * "pending" 5 minutes to 2 hours after creation. Sequential, not
 * parallel — this app's order volume doesn't need concurrency, and
 * sequential calls are gentler on Moolre's API.
 */
export const reconcilePendingPayments = internalAction({
  args: {},
  handler: async (ctx) => {
    const references: string[] = await ctx.runQuery(
      internal.internal.tickets.listStalePendingMoolreOrders,
      { minAgeMs: 5 * MINUTE, maxAgeMs: 2 * 60 * MINUTE },
    );

    if (references.length === 0) return;

    console.log(`[moolre reconcile] Re-checking ${references.length} stale pending order(s)`);
    for (const reference of references) {
      await ctx.runAction(internal.internal.moolre.verifyAndConfirmPayment, {
        externalref: reference,
      });
    }
  },
});
