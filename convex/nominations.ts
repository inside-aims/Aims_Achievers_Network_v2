import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireEventOwner, requireOrganizerProfile } from "./helpers";

// ─── Public mutations ─────────────────────────────────────────────────────────

/**
 * Anyone can submit a nomination — no account required.
 * The category must have allowsNominations = true and the event must have
 * nominationsOpen = true.
 */
export const submit = mutation({
  args: {
    eventId: v.id("events"),
    categoryId: v.id("categories"),
    nomineeName: v.string(),
    nomineeIdentifier: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const event = await ctx.db.get(args.eventId);
    if (!event) throw new Error("Event not found");
    if (!event.nominationsOpen) throw new Error("Nominations are closed for this event");

    const category = await ctx.db.get(args.categoryId);
    if (!category) throw new Error("Category not found");
    if (category.eventId !== args.eventId) throw new Error("Category does not belong to this event");
    if (!category.allowsNominations) throw new Error("This category does not accept nominations");

    return await ctx.db.insert("nominationSubmissions", {
      eventId: args.eventId,
      categoryId: args.categoryId,
      nomineeName: args.nomineeName.trim(),
      nomineeIdentifier: args.nomineeIdentifier?.trim(),
      avatarUrl: args.avatarUrl,
      status: "pending",
      createdAt: Date.now(),
    });
  },
});

// ─── Organizer queries ────────────────────────────────────────────────────────

export const listPending = query({
  args: { eventId: v.id("events") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    // Verify caller owns this event
    const profile = await requireOrganizerProfile(ctx);
    const event = await ctx.db.get(args.eventId);
    if (!event || event.organizerId !== profile._id) return [];

    return await ctx.db
      .query("nominationSubmissions")
      .withIndex("by_event_status", (q) =>
        q.eq("eventId", args.eventId).eq("status", "pending"),
      )
      .order("asc")
      .take(100);
  },
});

export const listAll = query({
  args: {
    eventId: v.id("events"),
    status: v.optional(
      v.union(v.literal("pending"), v.literal("approved"), v.literal("rejected")),
    ),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const profile = await requireOrganizerProfile(ctx);
    const event = await ctx.db.get(args.eventId);
    if (!event || event.organizerId !== profile._id) return [];

    if (args.status) {
      return await ctx.db
        .query("nominationSubmissions")
        .withIndex("by_event_status", (q) =>
          q.eq("eventId", args.eventId).eq("status", args.status!),
        )
        .order("desc")
        .take(200);
    }

    return await ctx.db
      .query("nominationSubmissions")
      .withIndex("by_event", (q) => q.eq("eventId", args.eventId))
      .order("desc")
      .take(200);
  },
});

// ─── Organizer mutations ──────────────────────────────────────────────────────

/**
 * Approving a nomination creates a nominee record and links it back to
 * the submission. The category sequence is incremented atomically to
 * generate the shortcode.
 */
export const approve = mutation({
  args: {
    submissionId: v.id("nominationSubmissions"),
    // Organizer can override the name or avatar before approving
    displayName: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
    bio: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const submission = await ctx.db.get(args.submissionId);
    if (!submission) throw new Error("Submission not found");
    if (submission.status !== "pending") throw new Error("Submission is not pending");

    const { event, profile } = await requireEventOwner(ctx, submission.eventId);

    const category = await ctx.db.get(submission.categoryId);
    if (!category) throw new Error("Category not found");

    // Atomically increment the sequence counter on the category
    const seq = category.nomineeSequence + 1;
    await ctx.db.patch(submission.categoryId, { nomineeSequence: seq });

    const shortcode = `${event.eventCode}-${category.categoryCode}-${String(seq).padStart(3, "0")}`;

    const nomineeId = await ctx.db.insert("nominees", {
      eventId: submission.eventId,
      categoryId: submission.categoryId,
      displayName: args.displayName ?? submission.nomineeName,
      shortcode,
      avatarUrl: args.avatarUrl ?? submission.avatarUrl,
      bio: args.bio,
      status: "active",
      totalVotes: 0,
      createdAt: Date.now(),
    });

    await ctx.db.patch(args.submissionId, {
      status: "approved",
      resolvedNomineeId: nomineeId,
      approvedAt: Date.now(),
      approvedBy: profile._id,
    });

    return nomineeId;
  },
});

export const reject = mutation({
  args: { submissionId: v.id("nominationSubmissions") },
  handler: async (ctx, args) => {
    const submission = await ctx.db.get(args.submissionId);
    if (!submission) throw new Error("Submission not found");
    if (submission.status !== "pending") throw new Error("Submission is not pending");

    await requireEventOwner(ctx, submission.eventId);
    await ctx.db.patch(args.submissionId, { status: "rejected" });
  },
});
