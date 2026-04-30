import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { RateLimiter, DAY } from "@convex-dev/rate-limiter";
import { components, internal } from "./_generated/api";
import { requireEventOwner, getOrganizerProfileOrNull } from "./helpers";

const rateLimiter = new RateLimiter(components.rateLimiter, {
  // Max 5 nominations from the same email per event per 24-hour window
  nominationSubmit: { kind: "fixed window", rate: 5, period: DAY },
});

// ─── Public mutations ─────────────────────────────────────────────────────────

/**
 * Returns a short-lived upload URL for the nominee photo.
 * Call this before submit(), upload the file, then pass the storageId.
 */
export const generatePhotoUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

/**
 * Submit a public nomination. No account required.
 * Guards: nominationsOpen, allowsNominations, rate limit, phone dedup.
 * If event.nominationAutoApprove is true, creates the nominee immediately.
 */
export const submit = mutation({
  args: {
    // Event & category (URL-friendly identifiers, not DB IDs)
    eventSlug: v.string(),
    categoryCode: v.string(),

    // Nominee info
    nomineeName: v.string(),
    nomineePhone: v.optional(v.string()),
    nomineeDepartment: v.optional(v.string()),
    nomineeYear: v.optional(v.string()),
    nomineeProgram: v.optional(v.string()),
    photoStorageId: v.optional(v.id("_storage")),

    // Nominator info
    nominatorName: v.string(),
    nominatorEmail: v.string(),
    nominatorPhone: v.optional(v.string()),
    nominatorRelationship: v.string(),

    // Nomination details
    nominationReason: v.string(),
    achievements: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // 1. Resolve event by slug
    const event = await ctx.db
      .query("events")
      .withIndex("by_slug", (q) => q.eq("slug", args.eventSlug))
      .unique();
    if (!event) throw new ConvexError("Event not found");
    if (!event.nominationsOpen) throw new ConvexError("Nominations are not open for this event");

    // 2. Resolve category by code within the event
    const category = await ctx.db
      .query("categories")
      .withIndex("by_event_code", (q) =>
        q.eq("eventId", event._id).eq("categoryCode", args.categoryCode),
      )
      .unique();
    if (!category) throw new ConvexError("Category not found");
    if (!category.allowsNominations)
      throw new ConvexError("This category is not open for nominations");

    // 3. Rate limit: 5 nominations per email per event per day
    const emailKey = `${args.nominatorEmail.toLowerCase().trim()}:${event._id}`;
    await rateLimiter.limit(ctx, "nominationSubmit", { key: emailKey, throws: true });

    // 4. Phone dedup: same nominee phone cannot be submitted twice in the same category
    const nomineeIdentifier = args.nomineePhone?.trim() || undefined;
    if (nomineeIdentifier) {
      const duplicate = await ctx.db
        .query("nominationSubmissions")
        .withIndex("by_category_identifier", (q) =>
          q.eq("categoryId", category._id).eq("nomineeIdentifier", nomineeIdentifier),
        )
        .first();
      if (duplicate)
        throw new ConvexError("This person has already been nominated in this category");
    }

    // 5. Resolve photo URL from storage
    let avatarUrl: string | undefined;
    if (args.photoStorageId) {
      avatarUrl = (await ctx.storage.getUrl(args.photoStorageId)) ?? undefined;
    }

    // 6. Insert nomination submission
    const submissionId = await ctx.db.insert("nominationSubmissions", {
      eventId: event._id,
      categoryId: category._id,
      nomineeName: args.nomineeName.trim(),
      nomineeIdentifier,
      nomineeDepartment: args.nomineeDepartment,
      nomineeYear: args.nomineeYear,
      nomineeProgram: args.nomineeProgram,
      photoStorageId: args.photoStorageId,
      avatarUrl,
      nominatorName: args.nominatorName.trim(),
      nominatorEmail: args.nominatorEmail.toLowerCase().trim(),
      nominatorPhone: args.nominatorPhone?.trim(),
      nominatorRelationship: args.nominatorRelationship,
      nominationReason: args.nominationReason,
      achievements: args.achievements || undefined,
      status: "pending",
      createdAt: Date.now(),
    });

    // 7. Auto-approve: skip review queue and create nominee immediately
    if (event.nominationAutoApprove) {
      const seq = category.nomineeSequence + 1;
      await ctx.db.patch(category._id, { nomineeSequence: seq });
      const shortcode = `${event.eventCode}-${category.categoryCode}-${String(seq).padStart(3, "0")}`;
      const nomineeId = await ctx.db.insert("nominees", {
        eventId: event._id,
        categoryId: category._id,
        displayName: args.nomineeName.trim(),
        shortcode,
        avatarUrl,
        bio: args.nominationReason.substring(0, 200),
        status: "active",
        totalVotes: 0,
        createdAt: Date.now(),
      });
      await ctx.db.patch(submissionId, {
        status: "approved",
        resolvedNomineeId: nomineeId,
        approvedAt: Date.now(),
      });

      if (nomineeIdentifier) {
        await ctx.scheduler.runAfter(0, internal.sms.sendNomineeApprovalSms, {
          phone: nomineeIdentifier,
          nomineeName: args.nomineeName.trim(),
          categoryName: category.name,
          eventName: event.title,
          shortcode,
        });
      }
    }

    return submissionId;
  },
});

// ─── Organizer queries ────────────────────────────────────────────────────────

/**
 * All nomination submissions for the organizer, grouped by event → category.
 * Returns a structure compatible with the NominationEvent[] shape used by the UI.
 */
export const listForOrganizer = query({
  args: {},
  handler: async (ctx) => {
    const profile = await getOrganizerProfileOrNull(ctx);
    if (!profile) return [];

    const events = await ctx.db
      .query("events")
      .withIndex("by_organizer", (q) => q.eq("organizerId", profile._id))
      .order("desc")
      .take(50);

    return Promise.all(
      events.map(async (event) => {
        const [categories, allSubmissions] = await Promise.all([
          ctx.db
            .query("categories")
            .withIndex("by_event", (q) => q.eq("eventId", event._id))
            .order("asc")
            .take(100),
          ctx.db
            .query("nominationSubmissions")
            .withIndex("by_event", (q) => q.eq("eventId", event._id))
            .order("desc")
            .take(200),
        ]);

        const subsByCategory = new Map<string, typeof allSubmissions>();
        for (const s of allSubmissions) {
          const key = s.categoryId as string;
          if (!subsByCategory.has(key)) subsByCategory.set(key, []);
          subsByCategory.get(key)!.push(s);
        }

        const categoriesWithSubs = categories.map((cat) => ({
          id: cat._id as string,
          name: cat.name,
          categoryCode: cat.categoryCode,
          submissions: (subsByCategory.get(cat._id as string) ?? []).map((s) => ({
            id: s._id as string,
            categoryId: s.categoryId as string,
            eventId: s.eventId as string,
            nomineeName: s.nomineeName,
            nomineePhone: s.nomineeIdentifier,
            nomineeDepartment: s.nomineeDepartment,
            nomineeYear: s.nomineeYear,
            nomineeProgram: s.nomineeProgram,
            avatarUrl: s.avatarUrl,
            nominatorName: s.nominatorName,
            nominatorEmail: s.nominatorEmail,
            nominatorPhone: s.nominatorPhone,
            nominatorRelationship: s.nominatorRelationship,
            nominationReason: s.nominationReason,
            achievements: s.achievements,
            status: s.status,
            createdAt: new Date(s.createdAt).toISOString(),
          })),
        }));

        return {
          id: event._id as string,
          title: event.title,
          status: event.status,
          eventCode: event.eventCode,
          categories: categoriesWithSubs,
        };
      }),
    );
  },
});

export const listPending = query({
  args: { eventId: v.id("events") },
  handler: async (ctx, args) => {
    const profile = await getOrganizerProfileOrNull(ctx);
    if (!profile) return [];
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
    const profile = await getOrganizerProfileOrNull(ctx);
    if (!profile) return [];

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
 * Approve a nomination — creates the nominee record and links it to the submission.
 * The organizer can override name, avatar, or bio before approving.
 */
export const approve = mutation({
  args: {
    submissionId: v.id("nominationSubmissions"),
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

    const seq = category.nomineeSequence + 1;
    await ctx.db.patch(submission.categoryId, { nomineeSequence: seq });
    const shortcode = `${event.eventCode}-${category.categoryCode}-${String(seq).padStart(3, "0")}`;

    const nomineeId = await ctx.db.insert("nominees", {
      eventId: submission.eventId,
      categoryId: submission.categoryId,
      displayName: args.displayName ?? submission.nomineeName,
      shortcode,
      avatarUrl: args.avatarUrl ?? submission.avatarUrl,
      bio: args.bio ?? submission.nominationReason?.substring(0, 200),
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

    if (submission.nomineeIdentifier) {
      await ctx.scheduler.runAfter(0, internal.sms.sendNomineeApprovalSms, {
        phone: submission.nomineeIdentifier,
        nomineeName: args.displayName ?? submission.nomineeName,
        categoryName: category.name,
        eventName: event.title,
        shortcode,
      });
    }

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
