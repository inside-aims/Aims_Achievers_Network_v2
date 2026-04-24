import { internalQuery, mutation } from "./_generated/server";
import { v } from "convex/values";
import { requireOrganizerProfile } from "./helpers";

/**
 * Returns a short-lived presigned upload URL for Convex built-in storage.
 * Only authenticated organizers may generate upload URLs.
 *
 * Client-side flow:
 *   1. Call this mutation → get `uploadUrl`
 *   2. POST the file: `fetch(uploadUrl, { method: "POST", body: file, headers: { "Content-Type": file.type } })`
 *   3. Response JSON → `{ storageId }`
 *   4. Pass `storageId` to any write mutation that stores it (e.g. createWithCategories)
 */
export const getFileUrl = internalQuery({
  args: { storageId: v.id("_storage") },
  handler: async (ctx, args) => {
    return await ctx.storage.getUrl(args.storageId);
  },
});

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    await requireOrganizerProfile(ctx);
    return await ctx.storage.generateUploadUrl();
  },
});
