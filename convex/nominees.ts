import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Doc } from "./_generated/dataModel";
import { requireEventOwner, generateShortcode } from "./helpers";

// ─── Queries ──────────────────────────────────────────────────────────────────

/**
 * All nominees for an event, grouped by category.
 * Ordered by createdAt asc — this is the display order on the voting page.
 */
export const listByEvent = query({
  args: { eventId: v.id("events") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("nominees")
      .withIndex("by_event", (q) => q.eq("eventId", args.eventId))
      .order("asc")
      .take(500);
  },
});

/** Nominees for a single category, ordered by creation time (voting page order). */
export const listByCategory = query({
  args: { categoryId: v.id("categories") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("nominees")
      .withIndex("by_category", (q) => q.eq("categoryId", args.categoryId))
      .order("asc")
      .take(200);
  },
});

/**
 * Leaderboard for a category: nominees sorted by totalVotes descending.
 * Only included when showVotes is true on the event.
 */
export const leaderboardByCategory = query({
  args: { eventId: v.id("events"), categoryId: v.id("categories") },
  handler: async (ctx, args) => {
    const event = await ctx.db.get(args.eventId);
    if (!event || !event.showVotes) return null;

    return await ctx.db
      .query("nominees")
      .withIndex("by_event_category_votes", (q) =>
        q.eq("eventId", args.eventId).eq("categoryId", args.categoryId),
      )
      .order("desc")
      .take(100);
  },
});

export const getById = query({
  args: { nomineeId: v.id("nominees") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.nomineeId);
  },
});

/**
 * Look up a nominee by shortcode for USSD voting.
 * Range-scans events by the parsed prefix so it works whether the stored
 * eventCode is already 3 chars ("CEA") or longer ("CEA2").
 * Returns null if not found or nominee/event is not active.
 */
export const getByShortcode = query({
  args: { shortcode: v.string() },
  handler: async (ctx, args) => {
    const upper = args.shortcode.trim().toUpperCase();
    const dashIndex = upper.indexOf("-");
    if (dashIndex === -1) return null;

    const evPrefix = upper.slice(0, dashIndex);

    // Range scan: matches events whose eventCode starts with evPrefix.
    // e.g. prefix "CEA" matches eventCode "CEA", "CEA2", "CEA2025", etc.
    const events = await ctx.db
      .query("events")
      .withIndex("by_eventCode", (q) =>
        q.gte("eventCode", evPrefix).lt("eventCode", evPrefix + "￿"),
      )
      .take(10);

    if (events.length === 0) return null;

    let nominee = null;
    let event = null;
    for (const ev of events) {
      const found = await ctx.db
        .query("nominees")
        .withIndex("by_shortcode", (q) => q.eq("eventId", ev._id).eq("shortcode", upper))
        .unique();
      if (found && found.status === "active") {
        nominee = found;
        event = ev;
        break;
      }
    }

    if (!nominee || !event) return null;

    const category = await ctx.db.get(nominee.categoryId) as Doc<"categories"> | null;

    return {
      nomineeId: nominee._id,
      displayName: nominee.displayName,
      shortcode: nominee.shortcode,
      categoryId: nominee.categoryId,
      categoryName: category?.name ?? "",
      eventId: event._id,
      eventTitle: event.title,
      votingOpen: event.votingOpen,
      votingMode: event.votingMode,
      pricePerVotePesewas: event.pricePerVotePesewas,
      bulkTiers: event.bulkTiers ?? [],
    };
  },
});

// ─── Mutations ────────────────────────────────────────────────────────────────

export const create = mutation({
  args: {
    eventId: v.id("events"),
    categoryId: v.id("categories"),
    displayName: v.string(),
    avatarUrl: v.optional(v.string()),
    bio: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { event } = await requireEventOwner(ctx, args.eventId);

    const category = await ctx.db.get(args.categoryId);
    if (!category) throw new Error("Category not found");
    if (category.eventId !== args.eventId) throw new Error("Category does not belong to this event");

    const shortcode = await generateShortcode(ctx, args.eventId);

    return await ctx.db.insert("nominees", {
      eventId: args.eventId,
      categoryId: args.categoryId,
      displayName: args.displayName,
      shortcode,
      avatarUrl: args.avatarUrl,
      bio: args.bio,
      status: "active",
      totalVotes: 0,
      createdAt: Date.now(),
    });
  },
});

export const update = mutation({
  args: {
    nomineeId: v.id("nominees"),
    displayName: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
    bio: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { nomineeId, ...fields } = args;
    const nominee = await ctx.db.get(nomineeId);
    if (!nominee) throw new Error("Nominee not found");

    await requireEventOwner(ctx, nominee.eventId);

    const patch: Record<string, unknown> = {};
    if (fields.displayName !== undefined) patch.displayName = fields.displayName;
    if (fields.avatarUrl !== undefined) patch.avatarUrl = fields.avatarUrl;
    if (fields.bio !== undefined) patch.bio = fields.bio;
    if (Object.keys(patch).length === 0) return;
    await ctx.db.patch(nomineeId, patch);
  },
});

export const disqualify = mutation({
  args: { nomineeId: v.id("nominees") },
  handler: async (ctx, args) => {
    const nominee = await ctx.db.get(args.nomineeId);
    if (!nominee) throw new Error("Nominee not found");

    await requireEventOwner(ctx, nominee.eventId);
    await ctx.db.patch(args.nomineeId, { status: "disqualified" });
  },
});

export const reinstate = mutation({
  args: { nomineeId: v.id("nominees") },
  handler: async (ctx, args) => {
    const nominee = await ctx.db.get(args.nomineeId);
    if (!nominee) throw new Error("Nominee not found");

    await requireEventOwner(ctx, nominee.eventId);
    await ctx.db.patch(args.nomineeId, { status: "active" });
  },
});
