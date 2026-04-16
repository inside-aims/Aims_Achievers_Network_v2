import { v } from "convex/values";
import { action, internalAction, internalMutation, internalQuery, query } from "./_generated/server";
import { api, internal } from "./_generated/api";
import { Id } from "./_generated/dataModel";
import { getAuthUserId } from "@convex-dev/auth/server";

// ─── Constants ────────────────────────────────────────────────────────────────

/** Temporary password assigned to all newly created organizer accounts. */
export const DEFAULT_ORGANIZER_PASSWORD = "AAN@Org2025!";

const ADMIN_SEED_EMAIL = "example123@gmail.com";
const ADMIN_SEED_PASSWORD = "password123";

// ─── Public Queries ───────────────────────────────────────────────────────────

/**
 * Returns the authenticated user's organizerProfile.
 * The profile's _id is used as the stable URL identifier for dashboard routes.
 * Used post-login to determine the redirect route.
 */
export const getMyProfile = query({
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

/**
 * Returns the authenticated user's organizerProfile, or null if not signed
 * in or if no profile has been created yet.
 */
export const getCurrentUserProfile = query({
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

/**
 * Admin only: list all event organizer profiles.
 * Returns an empty array if caller is not an admin.
 */
export const listOrganizers = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    const callerProfile = await ctx.db
      .query("organizerProfiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();

    if (!callerProfile || callerProfile.role !== "admin") return [];

    return await ctx.db
      .query("organizerProfiles")
      .withIndex("by_role", (q) => q.eq("role", "organizer"))
      .take(200);
  },
});

// ─── Public Actions ───────────────────────────────────────────────────────────

/**
 * Admin only: create a new event organizer account with a temporary default
 * password. The organizer will be prompted to change it on first login.
 */
export const createOrganizerAccount = action({
  args: {
    displayName: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const callerProfile = await ctx.runQuery(api.users.getCurrentUserProfile);
    if (!callerProfile || callerProfile.role !== "admin") {
      throw new Error("Unauthorized: only admins can create organizer accounts");
    }
    if (callerProfile.status !== "active") {
      throw new Error("Your account is inactive or suspended");
    }

    const normalizedEmail = args.email.trim().toLowerCase();

    // Check if an organizer with this email already exists
    const existingProfile = await ctx.runQuery(internal.users._getProfileByEmail, {
      email: normalizedEmail,
    });
    if (existingProfile) {
      throw new Error(`An account with email ${normalizedEmail} already exists`);
    }

    // Create the auth account via @convex-dev/auth's store mutation
    const result: { user: { _id: Id<"users"> } } = await ctx.runMutation(
      "auth:store" as any,
      {
        args: {
          type: "createAccountFromCredentials",
          provider: "password",
          account: {
            id: normalizedEmail,
            secret: DEFAULT_ORGANIZER_PASSWORD,
          },
          profile: {
            email: normalizedEmail,
            name: args.displayName,
          },
        },
      },
    );

    // Create the organizer profile
    await ctx.runMutation(internal.users._createOrganizerProfile, {
      userId: result.user._id,
      displayName: args.displayName,
      email: normalizedEmail,
      phone: args.phone,
      createdBy: callerProfile._id,
    });

    return { success: true, email: normalizedEmail };
  },
});

/**
 * Change the current user's password and clear the isPasswordDefault flag.
 * Must be authenticated. Enforces minimum length of 8 characters.
 */
export const changePassword = action({
  args: {
    newPassword: v.string(),
  },
  handler: async (ctx, args) => {
    const profile = await ctx.runQuery(api.users.getCurrentUserProfile);
    if (!profile) throw new Error("Not authenticated or profile not found");

    const email = profile.email;
    if (!email) throw new Error("Profile is missing email. Please contact your administrator.");

    if (args.newPassword.length < 8) {
      throw new Error("Password must be at least 8 characters");
    }

    if (args.newPassword === DEFAULT_ORGANIZER_PASSWORD) {
      throw new Error("You cannot reuse the default password. Please choose a new password.");
    }

    // Update the password in the auth system
    await ctx.runMutation("auth:store" as any, {
      args: {
        type: "modifyAccount",
        provider: "password",
        account: {
          id: email,
          secret: args.newPassword,
        },
      },
    });

    // Mark password as no longer default
    await ctx.runMutation(internal.users._clearPasswordDefault, {
      profileId: profile._id,
    });

    return { success: true };
  },
});

// ─── Admin Seed ───────────────────────────────────────────────────────────────

/**
 * Creates the platform admin account.
 * Run once with: npx convex run users:seedAdmin
 *
 * Admin credentials:
 *   Email:    example123@gmail.com
 *   Password: password123
 */
export const seedAdmin = internalAction({
  args: {},
  handler: async (ctx) => {
    // Check if admin already exists
    const existingProfile = await ctx.runQuery(internal.users._getProfileByEmail, {
      email: ADMIN_SEED_EMAIL,
    });
    if (existingProfile) {
      return {
        status: "already_seeded",
        message: "Admin account already exists — no changes made.",
      };
    }

    // Create the auth account (email + password in auth system)
    const result: { user: { _id: Id<"users"> } } = await ctx.runMutation(
      "auth:store" as any,
      {
        args: {
          type: "createAccountFromCredentials",
          provider: "password",
          account: {
            id: ADMIN_SEED_EMAIL,
            secret: ADMIN_SEED_PASSWORD,
          },
          profile: {
            email: ADMIN_SEED_EMAIL,
            name: "AAN Admin",
          },
        },
      },
    );

    // Create the admin organizerProfile
    await ctx.runMutation(internal.users._createAdminProfile, {
      userId: result.user._id,
    });

    return {
      status: "ok",
      message: `Admin seeded. Email: ${ADMIN_SEED_EMAIL} | Password: ${ADMIN_SEED_PASSWORD}`,
    };
  },
});

/**
 * Nukes the admin auth records and re-seeds from scratch.
 * Use this if the admin password hash is corrupted.
 * Run with: npx convex run users:nukeAndReseedAdmin
 */
export const nukeAndReseedAdmin = internalMutation({
  args: {},
  handler: async (ctx) => {
    // Delete authAccount for admin email
    const authAccount = await ctx.db
      .query("authAccounts" as any)
      .withIndex("providerAndAccountId" as any, (q: any) =>
        q.eq("provider", "password").eq("providerAccountId", ADMIN_SEED_EMAIL)
      )
      .unique();
    if (authAccount) {
      await ctx.db.delete((authAccount as any)._id);
    }

    // Delete organizerProfile
    const profile = await ctx.db
      .query("organizerProfiles")
      .withIndex("by_email", (q) => q.eq("email", ADMIN_SEED_EMAIL))
      .unique();
    if (profile) {
      await ctx.db.delete(profile._id);
    }

    // Delete all authSessions for the user
    if (profile) {
      const sessions = await ctx.db
        .query("authSessions" as any)
        .withIndex("userId" as any, (q: any) => q.eq("userId", profile.userId))
        .collect();
      for (const session of sessions) {
        await ctx.db.delete((session as any)._id);
      }

      // Delete authVerificationCodes if any
      const codes = await ctx.db
        .query("authVerificationCodes" as any)
        .filter((q: any) => q.eq(q.field("accountId"), authAccount?._id))
        .collect()
        .catch(() => []);
      for (const code of codes as any[]) {
        await ctx.db.delete(code._id);
      }

      // Delete all authAccounts for this user
      const allAccounts = await ctx.db
        .query("authAccounts" as any)
        .withIndex("userIdAndProvider" as any, (q: any) => q.eq("userId", profile.userId))
        .collect()
        .catch(() => []);
      for (const acct of allAccounts as any[]) {
        await ctx.db.delete(acct._id);
      }

      // Delete the user record itself
      await ctx.db.delete(profile.userId);
    }

    return { nuked: true };
  },
});

/**
 * Inspect admin auth account status for debugging.
 * Run with: npx convex run users:debugAdminAuth
 */
export const debugAdminAuth = internalQuery({
  args: {},
  handler: async (ctx) => {
    const profile = await ctx.db
      .query("organizerProfiles")
      .withIndex("by_email", (q) => q.eq("email", ADMIN_SEED_EMAIL))
      .unique();

    const authAccount = await ctx.db
      .query("authAccounts" as any)
      .withIndex("providerAndAccountId" as any, (q: any) =>
        q.eq("provider", "password").eq("providerAccountId", ADMIN_SEED_EMAIL)
      )
      .unique();

    const user = profile ? await ctx.db.get(profile.userId) : null;

    return {
      profileExists: !!profile,
      profileId: profile?._id,
      authAccountExists: !!authAccount,
      authAccountHasSecret: !!(authAccount as any)?.secret,
      userExists: !!user,
      userId: user?._id,
    };
  },
});

/**
 * Resets the admin password back to the seed password.
 * Use this if the admin auth account was lost after JWT key rotation.
 * Run with: npx convex run users:resetAdminPassword
 */
export const resetAdminPassword = internalAction({
  args: {},
  handler: async (ctx) => {
    await ctx.runMutation("auth:store" as any, {
      args: {
        type: "modifyAccount",
        provider: "password",
        account: {
          id: ADMIN_SEED_EMAIL,
          secret: ADMIN_SEED_PASSWORD,
        },
      },
    });
    return { status: "ok", message: `Admin password reset to seed value.` };
  },
});

// ─── Internal Helpers ─────────────────────────────────────────────────────────

export const _getProfileByEmail = internalQuery({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("organizerProfiles")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .unique();
  },
});

export const _getProfileByUserId = internalQuery({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("organizerProfiles")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .unique();
  },
});

export const _createAdminProfile = internalMutation({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("organizerProfiles")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .unique();
    if (existing) return existing._id;

    const now = Date.now();
    return await ctx.db.insert("organizerProfiles", {
      userId: args.userId,
      displayName: "AAN Admin",
      email: ADMIN_SEED_EMAIL,
      role: "admin",
      status: "active",
      isPasswordDefault: false,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const _createOrganizerProfile = internalMutation({
  args: {
    userId: v.id("users"),
    displayName: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    createdBy: v.id("organizerProfiles"),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("organizerProfiles")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .unique();
    if (existing) throw new Error("A profile already exists for this user");

    const now = Date.now();
    return await ctx.db.insert("organizerProfiles", {
      userId: args.userId,
      displayName: args.displayName,
      email: args.email,
      phone: args.phone,
      role: "organizer",
      status: "active",
      isPasswordDefault: true,
      createdBy: args.createdBy,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const _clearPasswordDefault = internalMutation({
  args: { profileId: v.id("organizerProfiles") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.profileId, {
      isPasswordDefault: false,
      updatedAt: Date.now(),
    });
  },
});

/** Admin only: suspend or reactivate an organizer account. */
export const updateOrganizerStatus = internalMutation({
  args: {
    profileId: v.id("organizerProfiles"),
    status: v.union(v.literal("active"), v.literal("inactive"), v.literal("suspended")),
  },
  handler: async (ctx, args) => {
    const profile = await ctx.db.get(args.profileId);
    if (!profile) throw new Error("Profile not found");
    if (profile.role === "admin") throw new Error("Cannot change status of admin accounts");

    await ctx.db.patch(args.profileId, {
      status: args.status,
      updatedAt: Date.now(),
    });
  },
});
