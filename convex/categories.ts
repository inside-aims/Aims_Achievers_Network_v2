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
    allowsNominations: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { categoryId, ...fields } = args;
    const category = await ctx.db.get(categoryId);
    if (!category) throw new Error("Category not found");

    await requireEventOwner(ctx, category.eventId);

    const patch: Record<string, unknown> = {};
    if (fields.name !== undefined) patch.name = fields.name;
    if (fields.allowsNominations !== undefined) patch.allowsNominations = fields.allowsNominations;
    if (Object.keys(patch).length === 0) return;
    await ctx.db.patch(categoryId, patch);
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
