import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { MutationCtx, QueryCtx } from "./_generated/server";
import { Id } from "./_generated/dataModel";
import { requireEventOwner, requireOrganizerProfile, getOrganizerProfileOrNull, slugify, generateEventCode, abbreviate } from "./helpers";

// ─── Public queries ───────────────────────────────────────────────────────────

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("events")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();
  },
});

export const getByEventCode = query({
  args: { eventCode: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("events")
      .withIndex("by_eventCode", (q) => q.eq("eventCode", args.eventCode.toUpperCase()))
      .unique();
  },
});

/** Public listing — only live events that are visible. */
export const listPublic = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("events")
      .withIndex("by_status_public", (q) =>
        q.eq("status", "live").eq("publicPageVisible", true),
      )
      .take(50);
  },
});

/**
 * Public listing shaped for the UI — live + closed events with their
 * categories embedded. Used by the events listing page.
 */
export const listPublicWithCategories = query({
  args: {},
  handler: async (ctx) => {
    const liveEvents = await ctx.db
      .query("events")
      .withIndex("by_status_public", (q) =>
        q.eq("status", "live").eq("publicPageVisible", true),
      )
      .order("desc")
      .take(50);

    const closedEvents = await ctx.db
      .query("events")
      .withIndex("by_status_public", (q) =>
        q.eq("status", "closed").eq("publicPageVisible", true),
      )
      .order("desc")
      .take(50);

    const tsToDate = (ts?: number) =>
      ts ? new Date(ts).toISOString().split("T")[0] : "";

    const result = [];
    for (const event of [...liveEvents, ...closedEvents]) {
      const categories = await ctx.db
        .query("categories")
        .withIndex("by_event", (q) => q.eq("eventId", event._id))
        .order("asc")
        .take(100);

      result.push({
        eventId: event.slug,
        title: event.title,
        description: event.description ?? "",
        image: event.bannerUrl ?? "",
        startDate: tsToDate(event.votingStartsAt),
        endDate: tsToDate(event.votingEndsAt),
        categories: categories.map((cat) => ({
          id: cat.categoryCode,
          name: cat.name,
          description: cat.description ?? "",
          votePrice: event.pricePerVotePesewas / 100,
        })),
      });
    }

    return result;
  },
});

/**
 * Fetch a single event by slug with all its categories.
 * Used by the /events/[eventId] page.
 */
export const getBySlugWithCategories = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const event = await ctx.db
      .query("events")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();

    if (!event) return null;

    const categories = await ctx.db
      .query("categories")
      .withIndex("by_event", (q) => q.eq("eventId", event._id))
      .order("asc")
      .take(100);

    const tsToDate = (ts?: number) =>
      ts ? new Date(ts).toISOString().split("T")[0] : "";

    return {
      eventId: event.slug,
      title: event.title,
      description: event.description ?? "",
      image: event.bannerUrl ?? "",
      startDate: tsToDate(event.votingStartsAt),
      endDate: tsToDate(event.votingEndsAt),
      categories: categories.map((cat) => ({
        id: cat.categoryCode,
        name: cat.name,
        description: cat.description ?? "",
        votePrice: event.pricePerVotePesewas / 100,
      })),
    };
  },
});

export const getById = query({
  args: { eventId: v.id("events") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.eventId);
  },
});

// ─── Organizer queries ────────────────────────────────────────────────────────

export const listByOrganizer = query({
  args: {},
  handler: async (ctx) => {
    const profile = await getOrganizerProfileOrNull(ctx);
    if (!profile) return [];
    return await ctx.db
      .query("events")
      .withIndex("by_organizer", (q) => q.eq("organizerId", profile._id))
      .order("desc")
      .take(100);
  },
});

// ─── Mutations ────────────────────────────────────────────────────────────────

export const create = mutation({
  args: {
    title: v.string(),
    institution: v.optional(v.string()),
    eventType: v.optional(v.string()),
    currency: v.optional(v.string()),
    description: v.optional(v.string()),
    bannerUrl: v.optional(v.string()),
    location: v.optional(v.string()),
    eventDate: v.optional(v.number()),
    votingStartsAt: v.optional(v.number()),
    votingEndsAt: v.optional(v.number()),
    votingMode: v.union(v.literal("standard"), v.literal("bulk")),
    pricePerVotePesewas: v.number(),
    bulkTiers: v.optional(
      v.array(v.object({ amountPesewas: v.number(), votes: v.number() })),
    ),
    // Organizer may provide custom codes, otherwise auto-generated
    slug: v.optional(v.string()),
    eventCode: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const profile = await requireOrganizerProfile(ctx);

    const baseSlug = args.slug ?? slugify(args.title);
    const slug = await uniqueSlug(ctx, baseSlug);

    const baseCode = (args.eventCode ?? generateEventCode(args.title)).toUpperCase();
    const eventCode = await uniqueEventCode(ctx, baseCode);

    // Platform cut is read from platform config — organizers never set this
    const platformCutPercent = await getPlatformCutPercent(ctx);

    return await ctx.db.insert("events", {
      organizerId: profile._id,
      title: args.title,
      institution: args.institution,
      eventType: args.eventType,
      currency: args.currency ?? "GHS",
      slug,
      eventCode,
      description: args.description,
      bannerUrl: args.bannerUrl,
      location: args.location,
      eventDate: args.eventDate,
      status: "draft",
      votingStartsAt: args.votingStartsAt,
      votingEndsAt: args.votingEndsAt,
      votingMode: args.votingMode,
      pricePerVotePesewas: args.pricePerVotePesewas,
      bulkTiers: args.bulkTiers,
      platformCutPercent,
      showVotes: true,
      votingOpen: false,
      publicPageVisible: false,
      nominationsOpen: false,
      nominationRequiresAuth: false,
      createdAt: Date.now(),
    });
  },
});

/**
 * Creates an event together with its initial categories in a single transaction.
 * Use this from the "New Event" form instead of calling create + categories.create N times.
 */
export const createWithCategories = mutation({
  args: {
    title: v.string(),
    institution: v.optional(v.string()),
    eventType: v.optional(v.string()),
    currency: v.optional(v.string()),
    description: v.optional(v.string()),
    bannerUrl: v.optional(v.string()),
    location: v.optional(v.string()),
    eventDate: v.optional(v.number()),
    votingStartsAt: v.optional(v.number()),
    votingEndsAt: v.optional(v.number()),
    votingMode: v.union(v.literal("standard"), v.literal("bulk")),
    pricePerVotePesewas: v.number(),
    bulkTiers: v.optional(
      v.array(v.object({ amountPesewas: v.number(), votes: v.number() })),
    ),
    showVotes: v.optional(v.boolean()),
    votingOpen: v.optional(v.boolean()),
    publicPageVisible: v.optional(v.boolean()),
    nominationsOpen: v.optional(v.boolean()),
    nominationAutoApprove: v.optional(v.boolean()),
    categories: v.array(
      v.object({ name: v.string(), description: v.optional(v.string()) }),
    ),
  },
  handler: async (ctx, args) => {
    const profile = await requireOrganizerProfile(ctx);

    const baseSlug = slugify(args.title);
    const slug = await uniqueSlug(ctx, baseSlug);

    const baseCode = generateEventCode(args.title).toUpperCase();
    const eventCode = await uniqueEventCode(ctx, baseCode);

    const platformCutPercent = await getPlatformCutPercent(ctx);

    const eventId = await ctx.db.insert("events", {
      organizerId: profile._id,
      title: args.title,
      institution: args.institution,
      eventType: args.eventType,
      currency: args.currency ?? "GHS",
      slug,
      eventCode,
      description: args.description,
      bannerUrl: args.bannerUrl,
      location: args.location,
      eventDate: args.eventDate,
      status: "draft",
      votingStartsAt: args.votingStartsAt,
      votingEndsAt: args.votingEndsAt,
      votingMode: args.votingMode,
      pricePerVotePesewas: args.pricePerVotePesewas,
      bulkTiers: args.bulkTiers,
      platformCutPercent,
      showVotes: args.showVotes ?? true,
      votingOpen: args.votingOpen ?? false,
      publicPageVisible: args.publicPageVisible ?? false,
      nominationsOpen: args.nominationsOpen ?? false,
      nominationRequiresAuth: false,
      nominationAutoApprove: args.nominationAutoApprove ?? false,
      createdAt: Date.now(),
    });

    const now = Date.now();
    for (const cat of args.categories) {
      const baseCode = abbreviate(cat.name).toUpperCase();
      const categoryCode = await uniqueCategoryCodeForEvent(ctx, eventId, baseCode);
      await ctx.db.insert("categories", {
        eventId,
        name: cat.name,
        description: cat.description,
        categoryCode,
        allowsNominations: true,
        nomineeSequence: 0,
        createdAt: now,
      });
    }

    return eventId;
  },
});

/** Update general event details. */
export const updateDetails = mutation({
  args: {
    eventId: v.id("events"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    bannerUrl: v.optional(v.string()),
    location: v.optional(v.string()),
    eventDate: v.optional(v.number()),
    votingStartsAt: v.optional(v.number()),
    votingEndsAt: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { eventId, ...fields } = args;
    await requireEventOwner(ctx, eventId);

    const patch: Record<string, unknown> = {};
    for (const [k, val] of Object.entries(fields)) {
      if (val !== undefined) patch[k] = val;
    }
    if (Object.keys(patch).length === 0) return;
    await ctx.db.patch(eventId, patch);
  },
});

/** Update voting configuration (price, mode, bulk tiers). */
export const updateVotingConfig = mutation({
  args: {
    eventId: v.id("events"),
    votingMode: v.union(v.literal("standard"), v.literal("bulk")),
    pricePerVotePesewas: v.number(),
    bulkTiers: v.optional(
      v.array(v.object({ amountPesewas: v.number(), votes: v.number() })),
    ),
  },
  handler: async (ctx, args) => {
    const { eventId, ...config } = args;
    await requireEventOwner(ctx, eventId);
    await ctx.db.patch(eventId, config);
  },
});

/**
 * Live toggles — can be flipped while the event is running.
 * Does NOT include platformCutPercent.
 */
export const updateLiveSettings = mutation({
  args: {
    eventId: v.id("events"),
    showVotes: v.optional(v.boolean()),
    votingOpen: v.optional(v.boolean()),
    publicPageVisible: v.optional(v.boolean()),
    nominationsOpen: v.optional(v.boolean()),
    nominationRequiresAuth: v.optional(v.boolean()),
    nominationAutoApprove: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { eventId, ...settings } = args;
    await requireEventOwner(ctx, eventId);

    const patch: Record<string, unknown> = {};
    for (const [k, val] of Object.entries(settings)) {
      if (val !== undefined) patch[k] = val;
    }
    if (Object.keys(patch).length === 0) return;
    await ctx.db.patch(eventId, patch);
  },
});

/** Status transitions (draft → published → live → closed). */
export const updateStatus = mutation({
  args: {
    eventId: v.id("events"),
    status: v.union(
      v.literal("draft"),
      v.literal("published"),
      v.literal("live"),
      v.literal("closed"),
    ),
  },
  handler: async (ctx, args) => {
    const { event } = await requireEventOwner(ctx, args.eventId);
    await ctx.db.patch(event._id, { status: args.status });
  },
});

// ─── Private helpers ──────────────────────────────────────────────────────────

async function uniqueSlug(ctx: QueryCtx | MutationCtx, base: string): Promise<string> {
  let slug = base;
  let n = 2;
  while (true) {
    const existing = await ctx.db
      .query("events")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .unique();
    if (!existing) return slug;
    slug = `${base}-${n++}`;
  }
}

async function uniqueEventCode(ctx: QueryCtx | MutationCtx, base: string): Promise<string> {
  let code = base;
  let n = 2;
  while (true) {
    const existing = await ctx.db
      .query("events")
      .withIndex("by_eventCode", (q) => q.eq("eventCode", code))
      .unique();
    if (!existing) return code;
    code = `${base}${n++}`;
  }
}

/** Reads the platform's default commission rate from platformConfig. Defaults to 10%. */
async function getPlatformCutPercent(ctx: QueryCtx | MutationCtx): Promise<number> {
  const config = await ctx.db.query("platformConfig").first();
  return config?.defaultPlatformCutPercent ?? 10;
}

/** Ensures a category code is unique within an event (used by createWithCategories). */
async function uniqueCategoryCodeForEvent(
  ctx: QueryCtx | MutationCtx,
  eventId: Id<"events">,
  base: string,
): Promise<string> {
  let code = base;
  let n = 2;
  while (true) {
    const existing = await ctx.db
      .query("categories")
      .withIndex("by_event_code", (q) => q.eq("eventId", eventId).eq("categoryCode", code))
      .unique();
    if (!existing) return code;
    code = `${base}${n++}`;
  }
}
