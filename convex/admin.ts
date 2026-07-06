import { v } from "convex/values";
import { query, mutation, QueryCtx } from "./_generated/server";
import { Id } from "./_generated/dataModel";
import { requireAdminProfile } from "./helpers";
import {
  votesByNominee,
  revenueByEvent,
  organizerRevenue,
} from "./internal/aggregates";

// ─── Ticket Stats Helper ────────────────────────────────────────────────────────

/**
 * Ticket revenue/counts computed directly from ticketTypes, mirroring the
 * math the organizer dashboard already uses (event-detail.tsx). Kept as a
 * separate metric from vote revenue — there's no platform-cut model for
 * ticket sales, so it should never be blended into "platform revenue".
 */
async function getTicketStats(ctx: QueryCtx, eventId: Id<"events">) {
  const ticketTypes = await ctx.db
    .query("ticketTypes")
    .withIndex("by_event", (q) => q.eq("eventId", eventId))
    .take(100);

  return {
    ticketTypesCount: ticketTypes.length,
    ticketsSold: ticketTypes.reduce((s, t) => s + t.quantitySold, 0),
    ticketRevenuePesewas: ticketTypes.reduce((s, t) => s + t.quantitySold * t.pricePesewas, 0),
  };
}

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

    const [voteSums, grossSums, orgRevSums, ticketStatsByEvent] = await Promise.all([
      votesByNominee.sumBatch(ctx, allEvents.map((e) => ({ namespace: e._id, bounds: undefined }))),
      revenueByEvent.sumBatch(ctx, allEvents.map((e) => ({ namespace: e._id, bounds: undefined }))),
      organizerRevenue.sumBatch(ctx, allEvents.map((e) => ({ namespace: e._id, bounds: undefined }))),
      Promise.all(allEvents.map((e) => getTicketStats(ctx, e._id))),
    ]);

    let totalVotes = 0;
    let totalRevenuePesewas = 0;
    let platformCutPesewas = 0;
    let totalTicketsSold = 0;
    let totalTicketRevenuePesewas = 0;
    for (let i = 0; i < allEvents.length; i++) {
      totalVotes += voteSums[i];
      totalRevenuePesewas += grossSums[i];
      platformCutPesewas += grossSums[i] - orgRevSums[i];
      totalTicketsSold += ticketStatsByEvent[i].ticketsSold;
      totalTicketRevenuePesewas += ticketStatsByEvent[i].ticketRevenuePesewas;
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
      totalTicketsSold,
      totalTicketRevenuePesewas,
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

    const [orgs, voteSums, revenueSums, categoriesCounts, ticketStatsByEvent] = await Promise.all([
      Promise.all(allEvents.map((e) => ctx.db.get(e.organizerId))),
      votesByNominee.sumBatch(ctx, allEvents.map((e) => ({ namespace: e._id, bounds: undefined }))),
      revenueByEvent.sumBatch(ctx, allEvents.map((e) => ({ namespace: e._id, bounds: undefined }))),
      Promise.all(
        allEvents.map((e) =>
          ctx.db
            .query("categories")
            .withIndex("by_event", (q) => q.eq("eventId", e._id))
            .take(100)
            .then((cats) => cats.length),
        ),
      ),
      Promise.all(allEvents.map((e) => getTicketStats(ctx, e._id))),
    ]);

    const enriched = allEvents.map((e, i) => {
      const ticketingEnabled = e.ticketingEnabled ?? false;
      return {
        _id: e._id,
        title: e.title,
        status: e.status,
        eventDate: e.eventDate,
        organizerId: e.organizerId,
        organizerName: orgs[i]?.displayName ?? "Unknown",
        totalVotes: voteSums[i],
        totalRevenuePesewas: revenueSums[i],
        ticketingEnabled,
        isTicketOnly: ticketingEnabled && categoriesCounts[i] === 0,
        ticketsSold: ticketStatsByEvent[i].ticketsSold,
        ticketRevenuePesewas: ticketStatsByEvent[i].ticketRevenuePesewas,
      };
    });

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
      ticketStats,
      scanCodes,
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
      getTicketStats(ctx, args.eventId),
      ctx.db
        .query("scanAccessCodes")
        .withIndex("by_event", (q) => q.eq("eventId", args.eventId))
        .take(100),
    ]);

    const categoriesCount = categories.length;
    const ticketingEnabled = event.ticketingEnabled ?? false;

    return {
      event,
      organizerName: org?.displayName ?? "Unknown",
      categoriesCount,
      nomineesCount: nominees.length,
      totalVotes,
      grossRevenuePesewas,
      platformFeePesewas: grossRevenuePesewas - organizerAmountPesewas,
      isTicketOnly: ticketingEnabled && categoriesCount === 0,
      ticketingEnabled,
      ticketsSold: ticketStats.ticketsSold,
      ticketRevenuePesewas: ticketStats.ticketRevenuePesewas,
      ticketTypesCount: ticketStats.ticketTypesCount,
      totalScans: scanCodes.reduce((s, c) => s + c.scansCount, 0),
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

// ─── Admin Ticket Breakdown ────────────────────────────────────────────────────

/** Admin only: ticket types for an event, each with its issued tickets. Read-only mirror of adminLeaderboard, for ticket-focus events. */
export const adminTicketBreakdown = query({
  args: { eventId: v.id("events") },
  handler: async (ctx, args) => {
    await requireAdminProfile(ctx);

    const event = await ctx.db.get(args.eventId);
    if (!event) return null;

    const [ticketTypes, tickets] = await Promise.all([
      ctx.db
        .query("ticketTypes")
        .withIndex("by_event", (q) => q.eq("eventId", args.eventId))
        .take(100),
      ctx.db
        .query("tickets")
        .withIndex("by_event", (q) => q.eq("eventId", args.eventId))
        .take(500),
    ]);

    return ticketTypes.map((ticketType) => ({
      ticketType,
      tickets: tickets.filter((t) => t.ticketTypeId === ticketType._id),
    }));
  },
});
