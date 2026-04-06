import { v } from "convex/values";
import { mutation } from "./_generated/server";
import { Doc } from "./_generated/dataModel";

/**
 * Called from the frontend when a voter clicks "Vote".
 * Creates a pending payment intent and returns the reference
 * that the frontend passes to Paystack's checkout.
 *
 * No auth required — voters are anonymous.
 */
export const createPaymentIntent = mutation({
  args: {
    eventId: v.id("events"),
    nomineeId: v.id("nominees"),
    categoryId: v.id("categories"),
    amountPesewas: v.number(),
    provider: v.union(v.literal("paystack"), v.literal("junipay")),
  },
  handler: async (ctx, args) => {
    // ── Validate event ────────────────────────────────────────────────────
    const event = await ctx.db.get(args.eventId);
    if (!event) throw new Error("Event not found");
    if (event.status !== "live") throw new Error("Event is not live");
    if (!event.votingOpen) throw new Error("Voting is currently closed");

    // ── Validate nominee ──────────────────────────────────────────────────
    const nominee = await ctx.db.get(args.nomineeId);
    if (!nominee) throw new Error("Nominee not found");
    if (nominee.status !== "active") throw new Error("Nominee is not active");
    if (nominee.eventId !== args.eventId) throw new Error("Nominee does not belong to this event");
    if (nominee.categoryId !== args.categoryId) throw new Error("Nominee category mismatch");

    // ── Resolve vote quantity and snapshot pricing ─────────────────────────
    const { votesAwarded, rateSnapshot } = resolveVotes(event, args.amountPesewas);

    // ── Generate unique provider reference ────────────────────────────────
    // Format: AAN-{eventCode}-{random hex}
    const randomHex = Array.from(crypto.getRandomValues(new Uint8Array(8)))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
    const providerReference = `AAN-${event.eventCode}-${randomHex}`.toUpperCase();

    // ── Create payment intent ─────────────────────────────────────────────
    const intentId = await ctx.db.insert("paymentIntents", {
      eventId: args.eventId,
      nomineeId: args.nomineeId,
      categoryId: args.categoryId,
      amountPesewas: args.amountPesewas,
      votesAwarded,
      rateSnapshot,
      provider: args.provider,
      providerReference,
      status: "pending",
      createdAt: Date.now(),
    });

    return {
      intentId,
      providerReference,
      votesAwarded,
      amountPesewas: args.amountPesewas,
    };
  },
});

// ─── Private helpers ──────────────────────────────────────────────────────────

function resolveVotes(
  event: Doc<"events">,
  amountPesewas: number,
): {
  votesAwarded: number;
  rateSnapshot: {
    mode: "standard" | "bulk";
    pricePerVotePesewas: number;
    bulkTier?: { amountPesewas: number; votes: number };
  };
} {
  if (amountPesewas <= 0) throw new Error("Amount must be greater than 0");

  if (event.votingMode === "bulk") {
    if (!event.bulkTiers || event.bulkTiers.length === 0) {
      throw new Error("Event has no bulk tiers configured");
    }
    const tier = event.bulkTiers.find((t) => t.amountPesewas === amountPesewas);
    if (!tier) throw new Error("Amount does not match any available bulk tier");

    return {
      votesAwarded: tier.votes,
      rateSnapshot: {
        mode: "bulk",
        pricePerVotePesewas: event.pricePerVotePesewas,
        bulkTier: tier,
      },
    };
  }

  // Standard mode: linear pricing
  if (amountPesewas % event.pricePerVotePesewas !== 0) {
    throw new Error(
      `Amount must be a multiple of ${event.pricePerVotePesewas} pesewas`,
    );
  }

  return {
    votesAwarded: amountPesewas / event.pricePerVotePesewas,
    rateSnapshot: {
      mode: "standard",
      pricePerVotePesewas: event.pricePerVotePesewas,
    },
  };
}
