import { NextRequest, NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

// ─── Types ────────────────────────────────────────────────────────────────────

interface UssdRequest {
  sessionID: string;
  userID: string;
  msisdn: string;
  network: string;
  userData: string;   // user's input for this step
  newSession: boolean;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function mapNetworkToProvider(network: string): string | null {
  const map: Record<string, string> = {
    MTN: "mtn",
    VODAFONE: "vod",
    AIRTELTIGO: "atl",
    TIGO: "atl",
    AIRTEL: "atl",
  };
  return map[network?.toUpperCase()] ?? null;
}

function normalizeMsisdn(msisdn: string): string {
  const clean = msisdn.replace(/^\+/, "");
  if (clean.startsWith("233")) return clean;
  if (clean.startsWith("0")) return "233" + clean.slice(1);
  return clean;
}

function respond(userID: string, sessionID: string, msisdn: string, message: string, continueSession: boolean) {
  return NextResponse.json({ userID, sessionID, msisdn, message, continueSession });
}

function formatGHS(pesewas: number): string {
  const ghs = pesewas / 100;
  return Number.isInteger(ghs) ? `GHS ${ghs}` : `GHS ${ghs.toFixed(2)}`;
}

function buildTierMenu(tiers: { amountPesewas: number; votes: number }[]): string {
  return [...tiers]
    .sort((a, b) => a.amountPesewas - b.amountPesewas)
    .map((t, i) => `${i + 1}. ${formatGHS(t.amountPesewas)} = ${t.votes} vote${t.votes !== 1 ? "s" : ""}`)
    .join("\n");
}

// ─── Handler ──────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const body: UssdRequest = await req.json();
  const { sessionID, userID, msisdn, network, userData, newSession } = body;

  const reply = (message: string, cont: boolean) =>
    respond(userID, sessionID, msisdn, message, cont);

  try {
    // ── New session: check for a pending OTP resume ───────────────────────
    if (newSession) {
      const pending = await convex.query(api.ussd.getPendingOtpSession, { msisdn });

      if (pending) {
        // Restore session under the new sessionId so subsequent inputs are tracked
        await convex.mutation(api.ussd.upsertSession, {
          sessionId: sessionID,
          msisdn,
          level: 6,
          nomineeId: pending.nomineeId,
          nomineeName: pending.nomineeName,
          categoryName: pending.categoryName,
          eventId: pending.eventId,
          categoryId: pending.categoryId,
          providerReference: pending.providerReference,
        });
        // Clean up the stale pending session
        await convex.mutation(api.ussd.deleteSessionById, { id: pending._id as Id<"ussdSessions"> });

        return reply("Enter the OTP sent to your phone to complete your vote:", true);
      }

      // Fresh session
      await convex.mutation(api.ussd.upsertSession, {
        sessionId: sessionID,
        msisdn,
        level: 1,
      });

      return reply("Welcome to AIMS Achievers Network Services Portal.\n1. E-Voting", true);
    }

    // ── Existing session ──────────────────────────────────────────────────
    const session = await convex.query(api.ussd.getSession, { sessionId: sessionID });

    if (!session) {
      return reply("Session expired. Please redial to start over.", false);
    }

    const level = session.level;

    // ── Level 1: Main menu ────────────────────────────────────────────────
    if (level === 1) {
      if (userData !== "1") {
        return reply("Invalid option. Dial again and press 1 for E-Voting.", false);
      }
      await convex.mutation(api.ussd.patchSession, { sessionId: sessionID, level: 2 });
      return reply("Enter Nominee Code:", true);
    }

    // ── Level 2: Nominee code ─────────────────────────────────────────────
    if (level === 2) {
      const code = userData.trim().toUpperCase();
      if (!code) {
        return reply("Nominee code cannot be empty. Enter Nominee Code:", true);
      }

      const nominee = await convex.query(api.nominees.getByShortcode, { shortcode: code });

      if (!nominee) {
        return reply(
          "Nominee code not found or voting is closed for this nominee. Check the code and redial.",
          false,
        );
      }

      if (!nominee.votingOpen) {
        return reply("Voting is currently closed for this event.", false);
      }

      await convex.mutation(api.ussd.patchSession, {
        sessionId: sessionID,
        level: 3,
        nomineeId: nominee.nomineeId as Id<"nominees">,
        nomineeName: nominee.displayName,
        categoryName: nominee.categoryName,
        eventId: nominee.eventId as Id<"events">,
        categoryId: nominee.categoryId as Id<"categories">,
      });

      return reply(
        `Confirm vote for:\n${nominee.displayName}\nCategory: ${nominee.categoryName}\n1. Yes\n2. No`,
        true,
      );
    }

    // ── Level 3: Confirm nominee ──────────────────────────────────────────
    if (level === 3) {
      if (userData === "2") {
        await convex.mutation(api.ussd.deleteSession, { sessionId: sessionID });
        return reply("Vote cancelled. Thank you!", false);
      }
      if (userData !== "1") {
        return reply(
          `Confirm vote for ${session.nomineeName}?\n1. Yes\n2. No`,
          true,
        );
      }
      await convex.mutation(api.ussd.patchSession, { sessionId: sessionID, level: 4 });

      // Show tier menu for bulk events, amount prompt for standard
      const eventForMode = await convex.query(api.events.getById, { eventId: session.eventId as Id<"events"> });
      if (eventForMode?.votingMode === "bulk" && eventForMode.bulkTiers?.length) {
        const menu = buildTierMenu(eventForMode.bulkTiers);
        return reply(`Select vote package:\n${menu}`, true);
      }
      return reply("Enter the amount in GHS you want to vote with (e.g. 1 for GHS 1):", true);
    }

    // ── Level 4: Amount / tier selection + initiate payment ──────────────
    if (level === 4) {
      // Resolve amountPesewas based on event voting mode
      const eventForPayment = await convex.query(api.events.getById, { eventId: session.eventId as Id<"events"> });

      let amountPesewas: number;

      if (eventForPayment?.votingMode === "bulk" && eventForPayment.bulkTiers?.length) {
        const sortedTiers = [...eventForPayment.bulkTiers].sort((a, b) => a.amountPesewas - b.amountPesewas);
        const selection = parseInt(userData.trim(), 10);
        if (isNaN(selection) || selection < 1 || selection > sortedTiers.length) {
          const menu = buildTierMenu(sortedTiers);
          return reply(`Invalid option. Select vote package:\n${menu}`, true);
        }
        amountPesewas = sortedTiers[selection - 1].amountPesewas;
      } else {
        const amountGHS = parseFloat(userData);
        if (isNaN(amountGHS) || amountGHS <= 0) {
          return reply("Invalid amount. Enter a number greater than 0 (e.g. 1):", true);
        }
        amountPesewas = Math.round(amountGHS * 100);
      }

      const provider = mapNetworkToProvider(network);

      if (!provider) {
        return reply(
          "Unsupported network. Please use MTN, AirtelTigo, or Vodafone.",
          false,
        );
      }

      // Create payment intent in Convex — locks price, generates our reference
      let providerReference: string;
      try {
        const intent = await convex.mutation(api.voting.createPaymentIntent, {
          eventId: session.eventId as Id<"events">,
          nomineeId: session.nomineeId as Id<"nominees">,
          categoryId: session.categoryId as Id<"categories">,
          amountPesewas,
          provider: "paystack",
        });
        providerReference = intent.providerReference;
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Voting error";
        await convex.mutation(api.ussd.deleteSession, { sessionId: sessionID });
        return reply(`Could not create vote: ${msg}. Please redial.`, false);
      }

      // Store reference in session before charging (so we can submit OTP if needed)
      await convex.mutation(api.ussd.patchSession, {
        sessionId: sessionID,
        providerReference,
      });

      // Initiate Paystack mobile money charge
      const normalized = normalizeMsisdn(msisdn);
      const paystackRes = await fetch("https://api.paystack.co/charge", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: amountPesewas,
          email: `${normalized}@voter.aimsnetwork.com`,
          currency: "GHS",
          reference: providerReference,
          mobile_money: { phone: normalized, provider },
          metadata: {
            custom_fields: [
              { display_name: "Nominee Name", variable_name: "nominee_name", value: session.nomineeName },
              { display_name: "Category Name", variable_name: "category_name", value: session.categoryName },
              { display_name: "Phone Number", variable_name: "phone_number", value: normalized },
            ],
          },
        }),
      });

      const chargeData = await paystackRes.json();

      if (!chargeData.status) {
        await convex.mutation(api.ussd.deleteSession, { sessionId: sessionID });
        return reply(
          `Payment could not be initiated: ${chargeData.message ?? "unknown error"}. Please redial.`,
          false,
        );
      }

      const chargeStatus = chargeData.data?.status;

      // MTN / AirtelTigo approval prompt (push notification)
      if (chargeStatus === "pay_offline") {
        await convex.mutation(api.ussd.deleteSession, { sessionId: sessionID });
        return reply(
          `${chargeData.data.display_text}. If no prompt after 30 seconds, check your mobile money approvals.`,
          false,
        );
      }

      // OTP required (Vodafone or MTN first-time)
      if (chargeStatus === "send_otp") {
        // Save pending state so user can resume by redialing
        await convex.mutation(api.ussd.patchSession, {
          sessionId: sessionID,
          level: 6,
          providerReference,
        });
        return reply(
          "An OTP has been sent to your phone. Please redial this code and enter it to complete your vote.",
          false,
        );
      }

      // Unexpected status
      await convex.mutation(api.ussd.deleteSession, { sessionId: sessionID });
      return reply(
        `Unexpected payment status: ${chargeStatus}. Please try again.`,
        false,
      );
    }

    // ── Level 6: OTP entry ────────────────────────────────────────────────
    if (level === 6) {
      const otp = userData.trim();
      if (!otp) {
        return reply("OTP cannot be empty. Enter the OTP from your phone:", true);
      }

      const otpRes = await fetch("https://api.paystack.co/charge/submit_otp", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ otp, reference: session.providerReference }),
      });

      const otpData = await otpRes.json();
      const otpStatus = otpData.data?.status;

      await convex.mutation(api.ussd.deleteSession, { sessionId: sessionID });

      if (otpStatus === "pay_offline" || otpStatus === "success") {
        const displayText = otpData.data?.display_text ?? "Payment initiated.";
        return reply(
          `${displayText}. Your votes will be recorded once confirmed. Thank you!`,
          false,
        );
      }

      return reply(
        `OTP submission failed: ${otpData.message ?? "unknown error"}. Please try voting again.`,
        false,
      );
    }

    // ── Unknown level ─────────────────────────────────────────────────────
    await convex.mutation(api.ussd.deleteSession, { sessionId: sessionID });
    return reply("An error occurred. Please redial to start over.", false);

  } catch (err) {
    console.error("USSD handler error:", err);
    // Best-effort cleanup
    try {
      await convex.mutation(api.ussd.deleteSession, { sessionId: sessionID });
    } catch { /* ignore */ }
    return reply("An unexpected error occurred. Please redial to try again.", false);
  }
}
