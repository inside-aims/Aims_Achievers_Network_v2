import { mutation } from "./_generated/server";
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
export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    await requireOrganizerProfile(ctx);
    return await ctx.storage.generateUploadUrl();
  },
});
