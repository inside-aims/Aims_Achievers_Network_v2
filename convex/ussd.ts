import { v } from "convex/values";
import { mutation, query, internalMutation } from "./_generated/server";

const SESSION_TTL_MS = 15 * 60 * 1000; // 15 minutes

// ─── Types ────────────────────────────────────────────────────────────────────

const sessionFields = {
  sessionId: v.string(),
  msisdn: v.string(),
  level: v.number(),
  nomineeId: v.optional(v.id("nominees")),
  nomineeName: v.optional(v.string()),
  categoryName: v.optional(v.string()),
  eventId: v.optional(v.id("events")),
  categoryId: v.optional(v.id("categories")),
  providerReference: v.optional(v.string()),
};

// ─── Queries ──────────────────────────────────────────────────────────────────

/** Fetch session by USSD gateway sessionId. */
export const getSession = query({
  args: { sessionId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("ussdSessions")
      .withIndex("by_sessionId", (q) => q.eq("sessionId", args.sessionId))
      .unique();
  },
});

/**
 * Find a pending OTP session for this msisdn.
 * Called on new session start to detect if the user previously received
 * an OTP and is redialing to complete it.
 */
export const getPendingOtpSession = query({
  args: { msisdn: v.string() },
  handler: async (ctx, args) => {
    const now = Date.now();
    const sessions = await ctx.db
      .query("ussdSessions")
      .withIndex("by_msisdn_level", (q) =>
        q.eq("msisdn", args.msisdn).eq("level", 6),
      )
      .order("desc")
      .take(1);

    const session = sessions[0];
    if (!session || session.expiresAt < now) return null;
    return session;
  },
});

// ─── Mutations ────────────────────────────────────────────────────────────────

/** Create or fully replace a session document. */
export const upsertSession = mutation({
  args: {
    ...sessionFields,
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("ussdSessions")
      .withIndex("by_sessionId", (q) => q.eq("sessionId", args.sessionId))
      .unique();

    const expiresAt = Date.now() + SESSION_TTL_MS;

    if (existing) {
      await ctx.db.patch(existing._id, { ...args, expiresAt });
    } else {
      await ctx.db.insert("ussdSessions", { ...args, expiresAt });
    }
  },
});

/** Patch specific fields on an existing session. */
export const patchSession = mutation({
  args: {
    sessionId: v.string(),
    level: v.optional(v.number()),
    nomineeId: v.optional(v.id("nominees")),
    nomineeName: v.optional(v.string()),
    categoryName: v.optional(v.string()),
    eventId: v.optional(v.id("events")),
    categoryId: v.optional(v.id("categories")),
    providerReference: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { sessionId, ...patch } = args;
    const session = await ctx.db
      .query("ussdSessions")
      .withIndex("by_sessionId", (q) => q.eq("sessionId", sessionId))
      .unique();
    if (!session) return;

    const defined = Object.fromEntries(
      Object.entries(patch).filter(([, v]) => v !== undefined),
    );
    await ctx.db.patch(session._id, {
      ...defined,
      expiresAt: Date.now() + SESSION_TTL_MS,
    });
  },
});

/** Delete a session when it ends normally. */
export const deleteSession = mutation({
  args: { sessionId: v.string() },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("ussdSessions")
      .withIndex("by_sessionId", (q) => q.eq("sessionId", args.sessionId))
      .unique();
    if (session) await ctx.db.delete(session._id);
  },
});

/** Delete an OTP-pending session by its Convex doc ID (after OTP submitted). */
export const deleteSessionById = mutation({
  args: { id: v.id("ussdSessions") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

// ─── Internal: cron cleanup ───────────────────────────────────────────────────

/** Deletes all expired USSD sessions. Called by the cron every 15 minutes. */
export const pruneExpiredSessions = internalMutation({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();
    const expired = await ctx.db
      .query("ussdSessions")
      .withIndex("by_expiry", (q) => q.lt("expiresAt", now))
      .take(200);

    await Promise.all(expired.map((s) => ctx.db.delete(s._id)));
    if (expired.length > 0) {
      console.log(`Pruned ${expired.length} expired USSD sessions`);
    }
  },
});
