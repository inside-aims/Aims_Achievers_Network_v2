import { v } from "convex/values";
import { query } from "./_generated/server";

/** Returns all platform-global outlets, featured ones first. */
export const listPublic = query({
  args: {},
  handler: async (ctx) => {
    const rows = await ctx.db
      .query("outlets")
      .withIndex("by_global", (q) => q.eq("isPlatformGlobal", true))
      .take(100);

    // Featured outlets first
    rows.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));

    return rows.map((o) => ({
      id: o._id as string,
      name: o.name,
      tagline: o.tagline ?? "",
      description: o.description ?? "",
      location: o.location ?? "",
      rating: o.rating ?? 0,
      reviews: o.reviews ?? 0,
      completedOrders: o.completedOrders ?? 0,
      specialties: o.specialties ?? [],
      phone: o.phone ?? "",
      whatsapp: o.whatsapp ?? "",
      website: o.website,
      portfolioImages: o.portfolioImages ?? [],
      featured: o.featured ?? false,
      responseTime: o.responseTime ?? "",
      yearsExperience: o.yearsExperience ?? 0,
      clientSatisfaction: o.clientSatisfaction ?? 0,
      verified: o.verified ?? false,
    }));
  },
});
