import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { requireAdminProfile } from "./helpers";
import {
  votesByNominee,
  revenueByEvent,
  organizerRevenue,
} from "./internal/aggregates";

// ─── Platform Overview ─────────────────────────────────────────────────────────

export const platformOverview = query({
  args: {},
  handler: async (ctx) => {
    await requireAdminProfile(ctx);

    const [allEvents, allOrganizers] = await Promise.all([
      ctx.db.query("events").order("desc").take(500),
      ctx.db
        .query("organizerProfiles")
        .withIndex("by_role", (q) => q.eq("role", "organizer"))
        .take(500),
    ]);

    const events = {
      total: allEvents.length,
      live: 0,
      published: 0,
      draft: 0,
      closed: 0,
    };
    for (const e of allEvents) {
      if (e.status === "live") events.live++;
      else if (e.status === "published") events.published++;
      else if (e.status === "draft") events.draft++;
      else if (e.status === "closed") events.closed++;
    }

    const organizers = {
      total: allOrganizers.length,
      active: allOrganizers.filter((o) => o.status === "active" || o.status === undefined).length,
      suspended: allOrganizers.filter((o) => o.status === "suspended").length,
    };

    console.log("All events ", allEvents)

    const aggregates = await Promise.all(
      allEvents.map((e) =>
        Promise.all([
          votesByNominee.sum(ctx, { namespace: e._id }),
          revenueByEvent.sum(ctx, { namespace: e._id }),
          organizerRevenue.sum(ctx, { namespace: e._id }),
        ]),
      ),
    );

    console.log("Aggregate ", aggregates)

    let totalVotes = 0;
    let totalRevenuePesewas = 0;
    let platformCutPesewas = 0;
    for (const [votes, gross, orgRev] of aggregates) {
      totalVotes += votes;
      totalRevenuePesewas += gross;
      platformCutPesewas += gross - orgRev;
    }

    const recentEvents = await Promise.all(
      allEvents.slice(0, 10).map(async (e) => {
        const org = await ctx.db.get(e.organizerId);
        return {
          _id: e._id,
          title: e.title,
          status: e.status,
          organizerName: org?.displayName ?? "Unknown",
          eventDate: e.eventDate,
        };
      }),
    );

    return {
      events,
      organizers,
      totalVotes,
      totalRevenuePesewas,
      platformCutPesewas,
      recentEvents,
    };
  },
});

// ─── List All Events ──────────────────────────────────────────────────────────

export const listAllEvents = query({
  args: {},
  handler: async (ctx) => {
    await requireAdminProfile(ctx);

    const allEvents = await ctx.db.query("events").order("desc").take(500);

    const enriched = await Promise.all(
      allEvents.map(async (e) => {
        const [org, totalVotes, totalRevenuePesewas] = await Promise.all([
          ctx.db.get(e.organizerId),
          votesByNominee.sum(ctx, { namespace: e._id }),
          revenueByEvent.sum(ctx, { namespace: e._id }),
        ]);
        return {
          _id: e._id,
          title: e.title,
          status: e.status,
          eventDate: e.eventDate,
          organizerId: e.organizerId,
          organizerName: org?.displayName ?? "Unknown",
          totalVotes,
          totalRevenuePesewas,
        };
      }),
    );

    return enriched;
  },
});

// ─── Organizer Detail ─────────────────────────────────────────────────────────

export const getOrganizerDetail = query({
  args: { organizerId: v.id("organizerProfiles") },
  handler: async (ctx, args) => {
    await requireAdminProfile(ctx);

    const organizer = await ctx.db.get(args.organizerId);
    if (!organizer) return null;

    const events = await ctx.db
      .query("events")
      .withIndex("by_organizer", (q) => q.eq("organizerId", args.organizerId))
      .order("desc")
      .take(100);

    const enrichedEvents = await Promise.all(
      events.map(async (e) => {
        const [totalVotes, grossRevenuePesewas] = await Promise.all([
          votesByNominee.sum(ctx, { namespace: e._id }),
          revenueByEvent.sum(ctx, { namespace: e._id }),
        ]);
        return {
          _id: e._id,
          title: e.title,
          status: e.status,
          eventDate: e.eventDate,
          totalVotes,
          grossRevenuePesewas,
        };
      }),
    );

    const stats = {
      totalEvents: events.length,
      totalVotes: enrichedEvents.reduce((s, e) => s + e.totalVotes, 0),
      totalRevenuePesewas: enrichedEvents.reduce((s, e) => s + e.grossRevenuePesewas, 0),
    };

    return { organizer, events: enrichedEvents, stats };
  },
});

// ─── Set Organizer Status ─────────────────────────────────────────────────────

export const setOrganizerStatus = mutation({
  args: {
    profileId: v.id("organizerProfiles"),
    status: v.union(v.literal("active"), v.literal("suspended")),
  },
  handler: async (ctx, args) => {
    await requireAdminProfile(ctx);

    const profile = await ctx.db.get(args.profileId);
    if (!profile) throw new Error("Profile not found");
    if (profile.role === "admin") throw new Error("Cannot change status of admin accounts");

    await ctx.db.patch(args.profileId, {
      status: args.status,
      updatedAt: Date.now(),
    });
  },
});

// ─── Admin Event Detail ───────────────────────────────────────────────────────

export const getAdminEventDetail = query({
  args: { eventId: v.id("events") },
  handler: async (ctx, args) => {
    await requireAdminProfile(ctx);

    const event = await ctx.db.get(args.eventId);
    if (!event) return null;

    const [
      org,
      categories,
      nominees,
      grossRevenuePesewas,
      organizerAmountPesewas,
      totalVotes,
    ] = await Promise.all([
      ctx.db.get(event.organizerId),
      ctx.db
        .query("categories")
        .withIndex("by_event", (q) => q.eq("eventId", args.eventId))
        .take(100),
      ctx.db
        .query("nominees")
        .withIndex("by_event", (q) => q.eq("eventId", args.eventId))
        .take(500),
      revenueByEvent.sum(ctx, { namespace: args.eventId }),
      organizerRevenue.sum(ctx, { namespace: args.eventId }),
      votesByNominee.sum(ctx, { namespace: args.eventId }),
    ]);

    return {
      event,
      organizerName: org?.displayName ?? "Unknown",
      categoriesCount: categories.length,
      nomineesCount: nominees.length,
      totalVotes,
      grossRevenuePesewas,
      platformFeePesewas: grossRevenuePesewas - organizerAmountPesewas,
    };
  },
});

// ─── Admin Leaderboard ────────────────────────────────────────────────────────

export const adminLeaderboard = query({
  args: { eventId: v.id("events") },
  handler: async (ctx, args) => {
    await requireAdminProfile(ctx);

    const event = await ctx.db.get(args.eventId);
    if (!event) return null;

    const categories = await ctx.db
      .query("categories")
      .withIndex("by_event", (q) => q.eq("eventId", args.eventId))
      .order("asc")
      .take(100);

    const result = await Promise.all(
      categories.map(async (category) => {
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
