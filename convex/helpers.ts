import { MutationCtx, QueryCtx } from "./_generated/server";
import { Id } from "./_generated/dataModel";

/** Returns the authenticated organizer profile, or throws. */
export async function requireOrganizerProfile(ctx: QueryCtx | MutationCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new Error("Not authenticated");

  // In Convex Auth, subject is the user's _id in the authTables users table
  const userId = identity.subject as Id<"users">;

  const profile = await ctx.db
    .query("organizerProfiles")
    .withIndex("by_userId", (q) => q.eq("userId", userId))
    .unique();

  if (!profile) throw new Error("Organizer profile not found. Please complete sign-up.");
  return profile;
}

/** Returns the authenticated organizer profile, or null if unauthenticated / no profile. */
export async function getOrganizerProfileOrNull(ctx: QueryCtx | MutationCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) return null;

  const userId = identity.subject as Id<"users">;

  return await ctx.db
    .query("organizerProfiles")
    .withIndex("by_userId", (q) => q.eq("userId", userId))
    .unique();
}

/** Asserts the caller owns the given event. */
export async function requireEventOwner(
  ctx: QueryCtx | MutationCtx,
  eventId: Id<"events">,
) {
  const profile = await requireOrganizerProfile(ctx);
  const event = await ctx.db.get(eventId);
  if (!event) throw new Error("Event not found");
  if (event.organizerId !== profile._id) throw new Error("Unauthorized");
  return { profile, event };
}

/** Generates a URL-friendly slug from a string. */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

/** Derives an abbreviation code from a name (e.g. "Best Male Student" → "BMS"). */
export function abbreviate(name: string): string {
  const words = name.trim().split(/\s+/);
  if (words.length === 1) return name.substring(0, 3).toUpperCase();
  return words.map((w) => w[0].toUpperCase()).join("");
}

/**
 * Generates an event code from the title, skipping common filler words.
 * e.g. "Xclusive Awards 2025" → "XA2025" (or "XA" for short titles)
 */
export function generateEventCode(title: string): string {
  const SKIP = new Set(["the", "a", "an", "and", "or", "of", "for", "in", "at", "to"]);
  const words = title.trim().split(/\s+/);
  const code = words
    .filter((w) => !SKIP.has(w.toLowerCase()))
    .map((w) => w[0].toUpperCase())
    .join("");
  return code || title.substring(0, 3).toUpperCase();
}
