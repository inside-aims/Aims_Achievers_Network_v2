import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

export default defineSchema({
  // Extend the built-in users table with a uuid for external reference
  ...authTables,
  users: defineTable({
    // ── Fields required by @convex-dev/auth ────────────────────────────
    name: v.optional(v.string()),
    image: v.optional(v.string()),
    email: v.optional(v.string()),
    emailVerificationTime: v.optional(v.number()),
    phone: v.optional(v.string()),
    phoneVerificationTime: v.optional(v.number()),
    isAnonymous: v.optional(v.boolean()),
  })
    .index("email", ["email"])
    .index("phone", ["phone"]),

  // ─────────────────────────────────────────────
  // ORGANIZER PROFILES
  // Authenticated users who create and manage events.
  // Voters are anonymous — they have no row here.
  // ─────────────────────────────────────────────
  organizerProfiles: defineTable({
    userId: v.id("users"),            // references authTables users
    displayName: v.string(),
    // Optional for backward-compat with pre-migration documents.
    // All new documents must include these — see convex/users.ts.
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    bio: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
    defaultCurrency: v.optional(v.string()),       // e.g. "GHS" — pre-fills new events
    defaultPriceVotePesewas: v.optional(v.number()), // e.g. 100 = GHS 1.00
    // Payout destination
    payoutMethod: v.optional(v.union(v.literal("momo"), v.literal("bank"))),
    momoNetwork: v.optional(v.union(v.literal("mtn"), v.literal("vodafone"), v.literal("airteltigo"))),
    momoNumber: v.optional(v.string()),
    momoName: v.optional(v.string()),
    bankName: v.optional(v.string()),
    bankAccountNumber: v.optional(v.string()),
    bankAccountName: v.optional(v.string()),
    role: v.union(
      v.literal("organizer"),
      v.literal("admin"),             // platform-level admin
    ),
    status: v.optional(v.union(
      v.literal("active"),
      v.literal("inactive"),
      v.literal("suspended"),
    )),
    isPasswordDefault: v.optional(v.boolean()), // true = must change before dashboard access
    createdBy: v.optional(v.id("organizerProfiles")), // which admin created this account
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
  })
    .index("by_userId", ["userId"])
    .index("by_email", ["email"])
    .index("by_role", ["role"])
    .index("by_status", ["status"]),


  // ─────────────────────────────────────────────
  // EVENTS
  // event_settings merged in — no reason to split.
  // ─────────────────────────────────────────────
  events: defineTable({
    organizerId: v.id("organizerProfiles"),
    title: v.string(),
    slug: v.string(),                 // URL-friendly: cs-awards-2025
    eventCode: v.string(),            // Shortcode prefix for nominees: e.g. "XA"

    institution: v.optional(v.string()),
    eventType: v.optional(v.string()),
    currency: v.optional(v.string()),           // e.g. "GHS" — display only

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
    nominationAutoApprove: v.optional(v.boolean()), // if true, skip review queue

    createdAt: v.number(),
  })
    .index("by_organizer", ["organizerId"])
    .index("by_slug", ["slug"])
    .index("by_eventCode", ["eventCode"])
    .index("by_status", ["status"])
    .index("by_status_public", ["status", "publicPageVisible"]),


  // ─────────────────────────────────────────────
  // CATEGORIES
  // e.g. "Best Developer", "Best Lecturer"
  // ─────────────────────────────────────────────
  categories: defineTable({
    eventId: v.id("events"),
    name: v.string(),
    description: v.optional(v.string()),
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
    .index("by_event_category_votes", ["eventId", "categoryId", "totalVotes"])  // per-category leaderboard
    .index("by_category_status_votes", ["categoryId", "status", "totalVotes"]),


  // ─────────────────────────────────────────────
  // NOMINATION SUBMISSIONS
  // Public submissions pending organizer approval.
  // ─────────────────────────────────────────────
  nominationSubmissions: defineTable({
    eventId: v.id("events"),
    categoryId: v.id("categories"),

    // ── Nominee info ───────────────────────────
    nomineeName: v.string(),
    nomineeIdentifier: v.optional(v.string()),  // phone — used for dedup
    nomineeDepartment: v.optional(v.string()),
    nomineeYear: v.optional(v.string()),
    nomineeProgram: v.optional(v.string()),
    photoStorageId: v.optional(v.id("_storage")),
    avatarUrl: v.optional(v.string()),           // resolved URL from photoStorageId

    // ── Nominator info ─────────────────────────
    nominatorName: v.string(),
    nominatorEmail: v.string(),
    nominatorPhone: v.optional(v.string()),
    nominatorRelationship: v.string(),

    // ── Nomination details ─────────────────────
    nominationReason: v.string(),
    achievements: v.optional(v.string()),

    // ── Status ─────────────────────────────────
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
    .index("by_event_status", ["eventId", "status"])
    .index("by_category_identifier", ["categoryId", "nomineeIdentifier"]),  // phone dedup


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
    tagline: v.optional(v.string()),
    description: v.optional(v.string()),
    location: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
    website: v.optional(v.string()),
    contactEmail: v.optional(v.string()),
    phone: v.optional(v.string()),
    whatsapp: v.optional(v.string()),
    category: v.optional(v.string()),          // e.g. "Trophies", "Event Décor"
    specialties: v.optional(v.array(v.string())),
    portfolioImages: v.optional(v.array(v.string())),
    rating: v.optional(v.number()),
    reviews: v.optional(v.number()),
    completedOrders: v.optional(v.number()),
    responseTime: v.optional(v.string()),
    yearsExperience: v.optional(v.number()),
    clientSatisfaction: v.optional(v.number()),
    featured: v.optional(v.boolean()),
    verified: v.optional(v.boolean()),
    isPlatformGlobal: v.boolean(),
    createdAt: v.number(),
  })
    .index("by_global", ["isPlatformGlobal"])
    .index("by_featured", ["featured"]),


  // ─────────────────────────────────────────────
  // USSD SESSIONS
  // Persists state between USSD interactions.
  // Sessions expire after 15 minutes; a cron prunes old rows.
  // The "level 6 resume" pattern: when a user redials after receiving
  // an OTP, we detect their pending level-6 session by msisdn and
  // restore context so they don't have to restart from scratch.
  // ─────────────────────────────────────────────
  ussdSessions: defineTable({
    sessionId: v.string(),          // USSD gateway's session identifier
    msisdn: v.string(),             // caller's phone number (e.g. 233551234567)
    level: v.number(),              // current state in the flow
    nomineeId: v.optional(v.id("nominees")),
    nomineeName: v.optional(v.string()),
    categoryName: v.optional(v.string()),
    eventId: v.optional(v.id("events")),
    categoryId: v.optional(v.id("categories")),
    providerReference: v.optional(v.string()),  // set after createPaymentIntent
    expiresAt: v.number(),          // ms timestamp — TTL for cron cleanup
  })
    .index("by_sessionId", ["sessionId"])
    .index("by_msisdn_level", ["msisdn", "level"])  // OTP resume lookup
    .index("by_expiry", ["expiresAt"]),              // cron cleanup


  // ─────────────────────────────────────────────
  // GALLERY
  // Event photo/media records.
  // ─────────────────────────────────────────────
  gallery: defineTable({
    urls: v.array(v.string()),
    category: v.string(),         // e.g. "Red Carpet", "Award Winner"
    eventName: v.string(),
    university: v.optional(v.string()),
    description: v.string(),
    photographer: v.optional(v.string()),
    uploadDate: v.string(),       // ISO date string "2025-06-15"
    isFeatured: v.boolean(),
    createdAt: v.number(),
  })
    .index("by_eventName", ["eventName"])
    .index("by_category", ["category"])
    .index("by_featured", ["isFeatured"]),
});
