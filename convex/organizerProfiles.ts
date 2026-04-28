import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

/** Get the current user's organizer profile. Returns null if not signed in. */
export const getCurrent = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    return await ctx.db
      .query("organizerProfiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();
  },
});

/** Update display name, phone, or avatar for the current user. */
export const update = mutation({
  args: {
    displayName: v.optional(v.string()),
    phone: v.optional(v.string()),
    bio: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const profile = await ctx.db
      .query("organizerProfiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();

    if (!profile) throw new Error("Profile not found");
    if (profile.status === "suspended" || profile.status === "inactive") {
      throw new Error("Account is inactive or suspended");
    }

    const patch: Record<string, unknown> = { updatedAt: Date.now() };
    if (args.displayName !== undefined) patch.displayName = args.displayName;
    if (args.phone !== undefined) patch.phone = args.phone;
    if (args.bio !== undefined) patch.bio = args.bio;
    if (args.avatarUrl !== undefined) patch.avatarUrl = args.avatarUrl;

    await ctx.db.patch(profile._id, patch);
  },
});
