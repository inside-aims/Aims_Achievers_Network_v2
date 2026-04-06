import { v } from "convex/values";
import { internalMutation } from "../_generated/server";
import {
  votesByNominee,
  revenueByEvent,
  organizerRevenue,
  votesByTime,
  nomineeVoteCounts,
} from "./aggregates";

/**
 * Records a confirmed vote after Paystack webhook verification.
 *
 * NEVER call this from the frontend — internal only.
 * Called exclusively from the Paystack webhook HTTP action after HMAC verification.
 *
 * Idempotent: safe to call twice for the same reference (duplicate webhooks).
 */
export const recordVote = internalMutation({
  args: {
    providerReference: v.string(),
    grossAmountPesewas: v.number(),
  },
  handler: async (ctx, args) => {
    // ── 1. Look up payment intent ─────────────────────────────────────────
    const intent = await ctx.db
      .query("paymentIntents")
      .withIndex("by_providerReference", (q) =>
        q.eq("providerReference", args.providerReference),
      )
      .unique();

    if (!intent) throw new Error(`Payment intent not found: ${args.providerReference}`);

    // ── 2. Idempotency guards ─────────────────────────────────────────────
    if (intent.status === "confirmed") return;
    if (intent.status === "failed") throw new Error("Payment already marked failed");

    const existingVote = await ctx.db
      .query("votes")
      .withIndex("by_paymentIntent", (q) => q.eq("paymentIntentId", intent._id))
      .unique();
    if (existingVote) {
      await ctx.db.patch(intent._id, { status: "confirmed" });
      return;
    }

    // ── 3. Load event for revenue split ──────────────────────────────────
    const event = await ctx.db.get(intent.eventId);
    if (!event) throw new Error("Event not found");

    // ── 4. Compute revenue split ──────────────────────────────────────────
    const platformFeePesewas = Math.floor(
      (args.grossAmountPesewas * event.platformCutPercent) / 100,
    );
    const organizerAmountPesewas = args.grossAmountPesewas - platformFeePesewas;

    // ── 5. Insert vote ────────────────────────────────────────────────────
    const now = Date.now();
    const voteId = await ctx.db.insert("votes", {
      eventId: intent.eventId,
      nomineeId: intent.nomineeId,
      categoryId: intent.categoryId,
      paymentIntentId: intent._id,
      quantity: intent.votesAwarded,
      grossAmountPesewas: args.grossAmountPesewas,
      platformFeePesewas,
      organizerAmountPesewas,
      platformCutPercentSnapshot: event.platformCutPercent,
      createdAt: now,
    });

    // ── 6. Mark payment intent confirmed ─────────────────────────────────
    await ctx.db.patch(intent._id, { status: "confirmed" });

    // ── 7. Update denormalized totalVotes on nominee ──────────────────────
    const nominee = await ctx.db.get(intent.nomineeId);
    if (nominee) {
      await ctx.db.patch(intent.nomineeId, {
        totalVotes: nominee.totalVotes + intent.votesAwarded,
      });
    }

    // ── 8. Update all aggregates ──────────────────────────────────────────
    const vote = await ctx.db.get(voteId);
    if (!vote) return;

    await votesByNominee.insert(ctx, vote);
    await revenueByEvent.insert(ctx, vote);
    await organizerRevenue.insert(ctx, vote);
    await votesByTime.insert(ctx, vote);

    // ── 9. Increment sharded counter for live card display ────────────────
    await nomineeVoteCounts.add(ctx, intent.nomineeId, intent.votesAwarded);
  },
});
