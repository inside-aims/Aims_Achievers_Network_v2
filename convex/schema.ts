import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

export default defineSchema({
  ...authTables,

  // ─────────────────────────────────────────────
  // ORGANIZER PROFILES
  // Authenticated users who create and manage events.
  // Voters are anonymous — they have no row here.
  // ─────────────────────────────────────────────
  organizerProfiles: defineTable({
    userId: v.id("users"),            // references authTables users
    displayName: v.string(),
    avatarUrl: v.optional(v.string()),
    role: v.union(
      v.literal("organizer"),
      v.literal("admin"),             // platform-level admin
    ),
    createdAt: v.number(),
  })
    .index("by_userId", ["userId"]),


  // ─────────────────────────────────────────────
  // EVENTS
  // event_settings merged in — no reason to split.
  // ─────────────────────────────────────────────
  events: defineTable({
    organizerId: v.id("organizerProfiles"),
    title: v.string(),
    slug: v.string(),                 // URL-friendly: cs-awards-2025
    eventCode: v.string(),            // Shortcode prefix for nominees: e.g. "XA"

    description: v.optional(v.string()),
    bannerUrl: v.optional(v.string()),
    location: v.optional(v.string()),
    eventDate: v.optional(v.number()),          // ms timestamp

    status: v.union(
      v.literal("draft"),
      v.literal("published"),
      v.literal("live"),
      v.literal("closed"),
    ),

    votingStartsAt: v.optional(v.number()),     // ms timestamp
    votingEndsAt: v.optional(v.number()),       // ms timestamp, used by cron to auto-close

    // ── Voting config ──────────────────────────
    votingMode: v.union(
      v.literal("standard"),    // GHS X per vote, linear
      v.literal("bulk"),        // organizer-defined tiers
    ),
    pricePerVotePesewas: v.number(),   // e.g. 100 = GHS 1.00

    // Only populated when votingMode === "bulk"
    // e.g. [{ amountPesewas: 1000, votes: 100 }, { amountPesewas: 500, votes: 40 }]
    bulkTiers: v.optional(
      v.array(
        v.object({
          amountPesewas: v.number(),
          votes: v.number(),
        }),
      ),
    ),

    // ── Revenue split ──────────────────────────
    // Stored on the event so changing it later doesn't
    // retroactively affect past votes.
    platformCutPercent: v.number(),    // e.g. 10 for 10%

    // ── Organizer live controls ─────────────────
    showVotes: v.boolean(),            // show vote counts on public page
    votingOpen: v.boolean(),           // manual kill switch
    publicPageVisible: v.boolean(),    // hide event from public listing

    // ── Nominations ────────────────────────────
    nominationsOpen: v.boolean(),
    nominationRequiresAuth: v.boolean(),

    createdAt: v.number(),
  })
    .index("by_organizer", ["organizerId"])
    .index("by_slug", ["slug"])
    .index("by_eventCode", ["eventCode"])
    .index("by_status", ["status"]),


  // ─────────────────────────────────────────────
  // CATEGORIES
  // e.g. "Best Developer", "Best Lecturer"
  // ─────────────────────────────────────────────
  categories: defineTable({
    eventId: v.id("events"),
    name: v.string(),
    categoryCode: v.string(),          // auto-generated abbreviation e.g. "BMS"
    allowsNominations: v.boolean(),    // whether public can submit nominations
    nomineeSequence: v.number(),       // atomic counter for shortcode generation
    createdAt: v.number(),
  })
    .index("by_event", ["eventId"])
    .index("by_event_code", ["eventId", "categoryCode"]),


  // ─────────────────────────────────────────────
  // NOMINEES
  // shortcode format: {eventCode}-{categoryCode}-{seq}
  // e.g. XA-BMS-001
  // ─────────────────────────────────────────────
  nominees: defineTable({
    eventId: v.id("events"),
    categoryId: v.id("categories"),
    displayName: v.string(),
    shortcode: v.string(),             // e.g. "XA-BMS-001", globally unique per event
    avatarUrl: v.optional(v.string()),
    bio: v.optional(v.string()),
    status: v.union(
      v.literal("active"),
      v.literal("disqualified"),
    ),
    totalVotes: v.number(),            // denormalized for leaderboard index
    createdAt: v.number(),
  })
    .index("by_event", ["eventId"])
    .index("by_category", ["categoryId"])
    .index("by_event_category", ["eventId", "categoryId"])
    .index("by_shortcode", ["eventId", "shortcode"])
    .index("by_event_votes", ["eventId", "totalVotes"])  // leaderboard sort (cross-category)
    .index("by_event_category_votes", ["eventId", "categoryId", "totalVotes"]),  // per-category leaderboard


  // ─────────────────────────────────────────────
  // NOMINATION SUBMISSIONS
  // Public submissions pending organizer approval.
  // ─────────────────────────────────────────────
  nominationSubmissions: defineTable({
    eventId: v.id("events"),
    categoryId: v.id("categories"),
    nomineeName: v.string(),
    nomineeIdentifier: v.optional(v.string()),  // student ID, email, etc.
    avatarUrl: v.optional(v.string()),
    status: v.union(
      v.literal("pending"),
      v.literal("approved"),
      v.literal("rejected"),
    ),
    resolvedNomineeId: v.optional(v.id("nominees")),
    approvedAt: v.optional(v.number()),
    approvedBy: v.optional(v.id("organizerProfiles")),
    createdAt: v.number(),
  })
    .index("by_event", ["eventId"])
    .index("by_event_status", ["eventId", "status"]),


  // ─────────────────────────────────────────────
  // PAYMENT INTENTS
  // Created when voter clicks "Vote" — before money moves.
  // Price is locked at intent creation time via rateSnapshot.
  // ─────────────────────────────────────────────
  paymentIntents: defineTable({
    eventId: v.id("events"),
    nomineeId: v.id("nominees"),
    categoryId: v.id("categories"),

    amountPesewas: v.number(),         // what voter is paying
    votesAwarded: v.number(),          // vote count resolved at intent creation

    // Snapshot of pricing at time of intent — immutable
    rateSnapshot: v.object({
      mode: v.union(v.literal("standard"), v.literal("bulk")),
      pricePerVotePesewas: v.number(),
      bulkTier: v.optional(
        v.object({
          amountPesewas: v.number(),
          votes: v.number(),
        }),
      ),
    }),

    provider: v.union(
      v.literal("paystack"),
      v.literal("junipay"),
    ),
    providerReference: v.string(),     // Paystack txn ref — used for dedup

    status: v.union(
      v.literal("pending"),            // voter is on checkout page
      v.literal("confirmed"),          // webhook verified, vote recorded
      v.literal("failed"),
    ),

    createdAt: v.number(),
  })
    .index("by_event", ["eventId"])
    .index("by_providerReference", ["providerReference"])  // webhook dedup
    .index("by_status", ["eventId", "status"]),


  // ─────────────────────────────────────────────
  // VOTES
  // Created ONLY from the internal recordVote mutation
  // after webhook verification. Never from the frontend.
  //
  // Revenue split stored here — single source of truth.
  // ─────────────────────────────────────────────
  votes: defineTable({
    eventId: v.id("events"),
    nomineeId: v.id("nominees"),
    categoryId: v.id("categories"),
    paymentIntentId: v.id("paymentIntents"),    // 1-to-1

    quantity: v.number(),                        // votes awarded
    grossAmountPesewas: v.number(),              // total paid
    platformFeePesewas: v.number(),              // platform's cut
    organizerAmountPesewas: v.number(),          // organizer's share
    platformCutPercentSnapshot: v.number(),      // locked at vote creation

    createdAt: v.number(),
  })
    .index("by_event", ["eventId"])
    .index("by_nominee", ["nomineeId"])
    .index("by_event_nominee", ["eventId", "nomineeId"])
    .index("by_category", ["categoryId"])
    .index("by_paymentIntent", ["paymentIntentId"]),     // dedup guard


  // ─────────────────────────────────────────────
  // PLATFORM CONFIG
  // Singleton document — only one row ever exists.
  // Only platform admins can modify these values.
  // ─────────────────────────────────────────────
  platformConfig: defineTable({
    defaultPlatformCutPercent: v.number(),  // e.g. 10 for 10%
    updatedAt: v.number(),
  }),


  // ─────────────────────────────────────────────
  // OUTLETS
  // Businesses in the awards/events ecosystem.
  // ─────────────────────────────────────────────
  outlets: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
    website: v.optional(v.string()),
    contactEmail: v.optional(v.string()),
    category: v.optional(v.string()),      // e.g. "Trophies", "Event Décor"
    isPlatformGlobal: v.boolean(),
    createdAt: v.number(),
  })
    .index("by_global", ["isPlatformGlobal"]),
});
