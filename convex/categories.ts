import { v } from "convex/values";
import { mutation, query, MutationCtx, QueryCtx } from "./_generated/server";
import { Id } from "./_generated/dataModel";
import { requireEventOwner, abbreviate } from "./helpers";

// ─── Queries ──────────────────────────────────────────────────────────────────

/** Lists all categories for an event, ordered by creation time. */
export const list = query({
  args: { eventId: v.id("events") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("categories")
      .withIndex("by_event", (q) => q.eq("eventId", args.eventId))
      .order("asc")
      .take(100);
  },
});

// ─── Mutations ────────────────────────────────────────────────────────────────

export const create = mutation({
  args: {
    eventId: v.id("events"),
    name: v.string(),
    description: v.optional(v.string()),
    allowsNominations: v.boolean(),
    // Organizer may override the auto-generated code
    categoryCode: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { event } = await requireEventOwner(ctx, args.eventId);

    const baseCode = (args.categoryCode ?? abbreviate(args.name)).toUpperCase();
    const categoryCode = await uniqueCategoryCode(ctx, event._id, baseCode);

    return await ctx.db.insert("categories", {
      eventId: args.eventId,
      name: args.name,
      description: args.description,
      categoryCode,
      allowsNominations: args.allowsNominations,
      nomineeSequence: 0,
      createdAt: Date.now(),
    });
  },
});

export const update = mutation({
  args: {
    categoryId: v.id("categories"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    allowsNominations: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { categoryId, ...fields } = args;
    const category = await ctx.db.get(categoryId);
    if (!category) throw new Error("Category not found");

    await requireEventOwner(ctx, category.eventId);

    const patch: Record<string, unknown> = {};
    if (fields.name !== undefined) patch.name = fields.name;
    if (fields.description !== undefined) patch.description = fields.description;
    if (fields.allowsNominations !== undefined) patch.allowsNominations = fields.allowsNominations;
    if (Object.keys(patch).length === 0) return;
    await ctx.db.patch(categoryId, patch);
  },
});

/**
 * Fetch a single category by its code within an event (looked up by slug),
 * including active nominees ordered by votes descending.
 * Used by the /events/[eventId]/[categoryId] page.
 */
export const getByCodeWithNominees = query({
  args: { eventSlug: v.string(), categoryCode: v.string() },
  handler: async (ctx, args) => {
    const event = await ctx.db
      .query("events")
      .withIndex("by_slug", (q) => q.eq("slug", args.eventSlug))
      .unique();

    if (!event) return null;

    const category = await ctx.db
      .query("categories")
      .withIndex("by_event_code", (q) =>
        q.eq("eventId", event._id).eq("categoryCode", args.categoryCode.toUpperCase()),
      )
      .unique();

    if (!category) return null;

    const nominees = await ctx.db
      .query("nominees")
      .withIndex("by_category_status_votes", (q) =>
        q.eq("categoryId", category._id).eq("status", "active"),
      )
      .order("desc")
      .take(200);

    const tsToDate = (ts?: number) =>
      ts ? new Date(ts).toISOString().split("T")[0] : "";

    return {
      id: category.categoryCode,
      name: category.name,
      description: category.description ?? "",
      votePrice: event.pricePerVotePesewas / 100,
      eventId: event.slug,
      eventTitle: event.title,
      eventEndDate: tsToDate(event.votingEndsAt),
      nominees: nominees.map((n) => ({
        nomineeId: n._id as string,
        nomineeCode: n.shortcode,
        fullName: n.displayName,
        description: n.bio ?? "",
        imageUrl: n.avatarUrl ?? "https://randomuser.me/api/portraits/men/1.jpg",
        votes: n.totalVotes,
      })),
    };
  },
});

export const remove = mutation({
  args: { categoryId: v.id("categories") },
  handler: async (ctx, args) => {
    const category = await ctx.db.get(args.categoryId);
    if (!category) throw new Error("Category not found");

    await requireEventOwner(ctx, category.eventId);
    await ctx.db.delete(args.categoryId);
  },
});

// ─── Private helpers ──────────────────────────────────────────────────────────

async function uniqueCategoryCode(
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
