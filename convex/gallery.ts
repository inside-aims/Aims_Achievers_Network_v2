import { query } from "./_generated/server";

/** Returns all gallery photos, newest upload date first. */
export const listAll = query({
  args: {},
  handler: async (ctx) => {
    const rows = await ctx.db
      .query("gallery")
      .order("desc")   // newest _creationTime first
      .take(200);

    return rows.map((p) => ({
      id: p._id as string,
      url: p.urls,
      category: p.category,
      eventName: p.eventName,
      university: p.university ?? "",
      description: p.description,
      photographer: p.photographer ?? "",
      uploadDate: p.uploadDate,
    }));
  },
});
