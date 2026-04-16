import { MutationCtx, QueryCtx } from "./_generated/server";
import { Id } from "./_generated/dataModel";
import { getAuthUserId } from "@convex-dev/auth/server";

// ─── Auth helpers ─────────────────────────────────────────────────────────────

/** Returns the authenticated organizer profile (any role), or throws. */
export async function requireOrganizerProfile(ctx: QueryCtx | MutationCtx) {
  const userId = await getAuthUserId(ctx);
  if (!userId) throw new Error("Not authenticated");

  const profile = await ctx.db
    .query("organizerProfiles")
    .withIndex("by_userId", (q) => q.eq("userId", userId))
    .unique();

  if (!profile) throw new Error("Organizer profile not found");
  // status is optional for backward-compat; treat undefined as "active"
  if (profile.status === "suspended" || profile.status === "inactive") {
    throw new Error("Account is inactive or suspended");
  }
  return profile;
}

/** Returns the authenticated ADMIN profile, or throws. */
export async function requireAdminProfile(ctx: QueryCtx | MutationCtx) {
  const profile = await requireOrganizerProfile(ctx);
  if (profile.role !== "admin") throw new Error("Unauthorized: admin access required");
  return profile;
}

/** Returns the authenticated organizer profile, or null if unauthenticated / no profile. */
export async function getOrganizerProfileOrNull(ctx: QueryCtx | MutationCtx) {
  const userId = await getAuthUserId(ctx);
  if (!userId) return null;

  return await ctx.db
    .query("organizerProfiles")
    .withIndex("by_userId", (q) => q.eq("userId", userId))
    .unique();
}

/** Asserts the caller owns the given event. Also checks organizer is active. */
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

// ─── Date / time utilities ─────────────────────────────────────────────────────

/**
 * Formats a ms timestamp as "Jan 15, 2025".
 * Returns an empty string if the value is undefined.
 */
export function formatDate(ms: number | undefined): string {
  if (ms === undefined) return "";
  return new Date(ms).toLocaleDateString("en-GH", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/**
 * Formats a ms timestamp as "Jan 15, 2025 · 2:30 PM".
 */
export function formatDateTime(ms: number | undefined): string {
  if (ms === undefined) return "";
  return new Date(ms).toLocaleString("en-GH", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

/**
 * Returns a human-readable relative time string.
 * e.g. "2 hours ago", "3 days ago", "just now"
 */
export function timeSince(ms: number): string {
  const diff = Date.now() - ms;
  const minutes = Math.floor(diff / 60_000);
  const hours = Math.floor(diff / 3_600_000);
  const days = Math.floor(diff / 86_400_000);

  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 30) return `${days}d ago`;
  return formatDate(ms);
}
