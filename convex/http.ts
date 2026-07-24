import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";
import { auth } from "./auth";
import { resend } from "./resend";

const http = httpRouter();

// Convex Auth routes (sign in, sign out, session refresh, etc.)
auth.addHttpRoutes(http);

// ─── Paystack Webhook ─────────────────────────────────────────────────────────

http.route({
  path: "/webhooks/paystack",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const rawBody = await request.text();

    // ── 1. Verify HMAC-SHA512 signature ──────────────────────────────────
    const secret = process.env.PAYSTACK_SECRET_KEY;
    if (!secret) {
      console.error("PAYSTACK_SECRET_KEY is not set");
      return new Response("Server misconfiguration", { status: 500 });
    }

    const signature = request.headers.get("x-paystack-signature");
    if (!signature) {
      return new Response("Missing signature", { status: 401 });
    }

    const isValid = await verifyPaystackSignature(rawBody, signature, secret);
    if (!isValid) {
      return new Response("Invalid signature", { status: 401 });
    }

    // ── 2. Parse payload ──────────────────────────────────────────────────
    let payload: PaystackWebhookPayload;
    try {
      payload = JSON.parse(rawBody);
    } catch {
      console.error("[webhook] Failed to parse JSON body");
      return new Response("Invalid JSON", { status: 400 });
    }

    console.log(`[webhook] Received event="${payload.event}" reference="${payload.data?.reference}" status="${payload.data?.status}" amount=${payload.data?.amount}`);

    // ── 3. Only handle successful charges ─────────────────────────────────
    if (payload.event !== "charge.success") {
      console.log(`[webhook] Ignoring non-charge event: ${payload.event}`);
      return new Response("OK", { status: 200 });
    }

    const { reference, amount, status } = payload.data;
    if (status !== "success") {
      console.log(`[webhook] Charge status is "${status}", skipping`);
      return new Response("OK", { status: 200 });
    }

    if (!reference) {
      console.error("[webhook] Missing reference in payload");
      return new Response("Missing reference", { status: 400 });
    }

    console.log(`[webhook] Processing charge — reference="${reference}" amount=${amount}`);

    // ── 4. Route to the correct handler based on reference prefix ─────────
    // Vote references:   AAN-{eventCode}-{hex}
    // Ticket references: TKT-{eventCode}-{hex}
    const isTicket = reference.startsWith("TKT-");
    console.log(`[webhook] Routing to ${isTicket ? "ticket" : "vote"} handler`);

    try {
      if (isTicket) {
        await ctx.runMutation(internal.internal.tickets.confirmTicketOrderByReference, {
          providerReference: reference,
          grossAmountPesewas: amount,
        });
        console.log(`[webhook] Ticket order confirmed for reference="${reference}"`);
      } else {
        await ctx.runMutation(internal.internal.votes.recordVote, {
          providerReference: reference,
          grossAmountPesewas: amount,
        });
        console.log(`[webhook] Vote recorded for reference="${reference}"`);
      }
    } catch (err) {
      console.error(`[webhook] Handler failed for reference="${reference}":`, err);
      return new Response("Handler failed", { status: 500 });
    }

    return new Response("OK", { status: 200 });
  }),
});

// ─── Moolre Webhook ───────────────────────────────────────────────────────────
//
// Moolre echoes a per-account `secret` inside data (found in the dashboard,
// same value returned by their account create/update APIs). We compare it
// against MOOLRE_WEBHOOK_SECRET with a constant-time check before trusting
// anything in the payload. The actual confirm/fail decision still comes from
// calling Moolre's own Payment Status API (see internal/moolre.ts) rather
// than the webhook's own txstatus field — belt and suspenders.

http.route({
  path: "/webhooks/moolre",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const rawBody = await request.text();

    const expectedSecret = process.env.MOOLRE_WEBHOOK_SECRET;
    if (!expectedSecret) {
      console.error("MOOLRE_WEBHOOK_SECRET is not set");
      return new Response("Server misconfiguration", { status: 500 });
    }

    let payload: MoolreWebhookPayload;
    try {
      payload = JSON.parse(rawBody);
    } catch {
      console.error("[moolre webhook] Failed to parse JSON body");
      return new Response("Invalid JSON", { status: 400 });
    }

    const providedSecret = payload.data?.secret;
    if (!providedSecret || !timingSafeEqualString(providedSecret, expectedSecret)) {
      console.warn("[moolre webhook] Rejected — missing or invalid secret");
      return new Response("Invalid secret", { status: 401 });
    }

    const reference = payload.data?.reference;
    if (!reference || !reference.startsWith("TKT-")) {
      const redactedData = { ...payload.data };
      delete redactedData.secret;
      console.log(`[moolre webhook] Ignoring payload with no recognizable ticket reference — parsed data: ${JSON.stringify(redactedData)}`);
      return new Response("OK", { status: 200 });
    }

    console.log(`[moolre webhook] reference="${reference}" — triggering status verification`);
    await ctx.runAction(internal.internal.moolre.verifyAndConfirmPayment, {
      externalref: reference,
    });

    return new Response("OK", { status: 200 });
  }),
});

// ─── Resend Webhook ───────────────────────────────────────────────────────────

http.route({
  path: "/resend-webhook",
  method: "POST",
  handler: httpAction(async (ctx, req) => {
    return await resend.handleResendEventWebhook(ctx, req);
  }),
});

export default http;

// ─── Types ────────────────────────────────────────────────────────────────────

interface PaystackWebhookPayload {
  event: string;
  data: {
    reference: string;
    amount: number;     // in pesewas
    status: string;
    [key: string]: unknown;
  };
}

interface MoolreWebhookPayload {
  status?: number | string;
  code?: string;
  message?: string | null;
  data?: {
    // Confirmed from a real sandbox payload — the field is `reference`,
    // not `externalref` as the generic docs example implied.
    reference: string;
    secret?: string;
    txstatus?: number | string;
    txid?: number | string;
    [key: string]: unknown;
  };
}

// ─── HMAC-SHA512 verification using Web Crypto API ────────────────────────────

async function verifyPaystackSignature(
  body: string,
  signature: string,
  secret: string,
): Promise<boolean> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-512" },
    false,
    ["sign"],
  );
  const mac = await crypto.subtle.sign("HMAC", key, encoder.encode(body));
  const computed = Array.from(new Uint8Array(mac))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  return computed === signature;
}

// ─── Constant-time string comparison (Moolre webhook secret) ─────────────────

function timingSafeEqualString(a: string, b: string): boolean {
  const encoder = new TextEncoder();
  const bytesA = encoder.encode(a);
  const bytesB = encoder.encode(b);

  // Length mismatch is itself not secret — but still compare a full pass
  // over the longer buffer so the check takes the same time either way.
  const length = Math.max(bytesA.length, bytesB.length);
  let diff = bytesA.length ^ bytesB.length;
  for (let i = 0; i < length; i++) {
    diff |= (bytesA[i] ?? 0) ^ (bytesB[i] ?? 0);
  }
  return diff === 0;
}
