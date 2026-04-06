import { v } from "convex/values";
import { query } from "./_generated/server";
import { getOrganizerProfileOrNull } from "./helpers";
import {
  votesByNominee,
  revenueByEvent,
  organizerRevenue,
  votesByTime,
  nomineeVoteCounts,
} from "./internal/aggregates";
import { Id } from "./_generated/dataModel";

/**
 * Full dashboard stats for an event.
 * Returns null if the caller doesn't own the event.
 */
export const eventStats = query({
  args: { eventId: v.id("events") },
  handler: async (ctx, args) => {
    const profile = await getOrganizerProfileOrNull(ctx);
    if (!profile) return null;

    const event = await ctx.db.get(args.eventId);
    if (!event || event.organizerId !== profile._id) return null;

    const oneHourAgo = Date.now() - 3_600_000;

    const [
      totalVotes,
      grossRevenuePesewas,
      organizerAmountPesewas,
      votesLastHour,
      categories,
    ] = await Promise.all([
      votesByNominee.sum(ctx, { namespace: args.eventId }),
      revenueByEvent.sum(ctx, { namespace: args.eventId }),
      organizerRevenue.sum(ctx, { namespace: args.eventId }),
      votesByTime.sum(ctx, {
        namespace: args.eventId,
        bounds: { lower: { key: oneHourAgo, inclusive: true } },
      }),
      ctx.db
        .query("categories")
        .withIndex("by_event", (q) => q.eq("eventId", args.eventId))
        .take(100),
    ]);

    const platformFeePesewas = grossRevenuePesewas - organizerAmountPesewas;

    return {
      totalVotes,
      grossRevenuePesewas,
      organizerAmountPesewas,
      platformFeePesewas,
      votesLastHour,
      categoriesCount: categories.length,
    };
  },
});

/**
 * Leaderboard for all categories in an event.
 * Returns nominees grouped by category, sorted by totalVotes desc within each.
 * Respects the event's showVotes toggle — returns null if votes are hidden.
 */
export const leaderboard = query({
  args: { eventId: v.id("events") },
  handler: async (ctx, args) => {
    const event = await ctx.db.get(args.eventId);
    if (!event) return null;

    // Public visitors only see this when showVotes is on
    const identity = await ctx.auth.getUserIdentity();
    const isOrganizer = identity !== null;

    if (!event.showVotes && !isOrganizer) return null;

    const categories = await ctx.db
      .query("categories")
      .withIndex("by_event", (q) => q.eq("eventId", args.eventId))
      .order("asc")
      .take(100);

    const result = await Promise.all(
      categories.map(async (category) => {
        // Nominees sorted by totalVotes desc (uses by_event_votes index)
        const nominees = await ctx.db
          .query("nominees")
          .withIndex("by_event_votes", (q) => q.eq("eventId", args.eventId))
          .order("desc")
          .filter((q) => q.eq(q.field("categoryId"), category._id))
          .take(50);

        return { category, nominees };
      }),
    );

    return result;
  },
});

/**
 * Live vote count for a single nominee.
 * Uses the sharded counter for low-latency reads under high concurrency.
 */
export const nomineeVoteCount = query({
  args: { nomineeId: v.id("nominees") },
  handler: async (ctx, args) => {
    return await nomineeVoteCounts.count(ctx, args.nomineeId);
  },
});

/**
 * Votes per nominee for a category using the aggregate.
 * For organizer dashboard charts — gives exact sums per nominee.
 */
export const categoryBreakdown = query({
  args: {
    eventId: v.id("events"),
    categoryId: v.id("categories"),
  },
  handler: async (ctx, args) => {
    const profile = await getOrganizerProfileOrNull(ctx);
    if (!profile) return null;

    const event = await ctx.db.get(args.eventId);
    if (!event || event.organizerId !== profile._id) return null;

    const nominees = await ctx.db
      .query("nominees")
      .withIndex("by_event_category", (q) =>
        q.eq("eventId", args.eventId).eq("categoryId", args.categoryId),
      )
      .order("asc")
      .take(200);

    const breakdown = await Promise.all(
      nominees.map(async (nominee) => {
        const votes = await votesByNominee.sum(ctx, {
          namespace: args.eventId,
          bounds: { prefix: [nominee._id] },
        });
        return { nominee, votes };
      }),
    );

    // Sort by votes descending for the chart
    breakdown.sort((a, b) => b.votes - a.votes);
    return breakdown;
  },
});

/**
 * Revenue breakdown over time — hourly buckets for the last 24 hours.
 * Organizer-only.
 */
export const revenueTimeline = query({
  args: { eventId: v.id("events") },
  handler: async (ctx, args) => {
    const profile = await getOrganizerProfileOrNull(ctx);
    if (!profile) return null;

    const event = await ctx.db.get(args.eventId);
    if (!event || event.organizerId !== profile._id) return null;

    const now = Date.now();
    const buckets: Array<{ hourStart: number; revenuePesewas: number; votes: number }> = [];

    // Build 24 hourly buckets
    for (let i = 23; i >= 0; i--) {
      const hourStart = now - i * 3_600_000;
      const hourEnd = hourStart + 3_600_000;

      const [revenuePesewas, votes] = await Promise.all([
        revenueByEvent.sum(ctx, {
          namespace: args.eventId,
          bounds: {
            lower: { key: hourStart, inclusive: true },
            upper: { key: hourEnd, inclusive: false },
          },
        }),
        votesByTime.sum(ctx, {
          namespace: args.eventId,
          bounds: {
            lower: { key: hourStart, inclusive: true },
            upper: { key: hourEnd, inclusive: false },
          },
        }),
      ]);

      buckets.push({ hourStart, revenuePesewas, votes });
    }

    return buckets;
  },
});
