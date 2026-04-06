import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireEventOwner } from "./helpers";

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
      .withIndex("by_event_votes", (q) => q.eq("eventId", args.eventId))
      .order("desc")
      .filter((q) => q.eq(q.field("categoryId"), args.categoryId))
      .take(100);
  },
});

export const getById = query({
  args: { nomineeId: v.id("nominees") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.nomineeId);
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

    // Atomically increment the sequence counter on the category
    const seq = category.nomineeSequence + 1;
    await ctx.db.patch(args.categoryId, { nomineeSequence: seq });

    // Build shortcode: {eventCode}-{categoryCode}-{seq padded to 3 digits}
    const shortcode = `${event.eventCode}-${category.categoryCode}-${String(seq).padStart(3, "0")}`;

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
