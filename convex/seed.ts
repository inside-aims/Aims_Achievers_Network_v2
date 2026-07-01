import { internalMutation } from "./_generated/server";

/**
 * One-time migration: backfill new required fields on existing organizerProfiles
 * documents that were created before the schema was updated.
 *
 * Run via: npx convex run seed:migrateProfiles
 * Or: Convex dashboard → Functions → seed:migrateProfiles → Run
 */
export const migrateProfiles = internalMutation({
  args: {},
  handler: async (ctx) => {
    const profiles = await ctx.db.query("organizerProfiles").take(500);
    let patched = 0;

    for (const profile of profiles) {
      const update: Record<string, unknown> = {};
      const now = Date.now();

      if ((profile as any).email === undefined) {
        // Best-effort: look up the auth user's email
        const user = await ctx.db.get(profile.userId);
        update.email = (user as any)?.email ?? `${profile.userId}@migrated.internal`;
      }
      if ((profile as any).status === undefined) update.status = "active";
      if ((profile as any).isPasswordDefault === undefined) update.isPasswordDefault = false;
      if ((profile as any).updatedAt === undefined) update.updatedAt = now;

      if (Object.keys(update).length > 0) {
        await ctx.db.patch(profile._id, update as any);
        patched++;
      }
    }

    return { status: "ok", patched };
  },
});

// ─── Raw seed data (mirrors scripts/seed.ts) ─────────────────────────────────

const EVENTS_DATA = [
  {
    slug: "fast-awards-2025",
    eventCode: "FA",
    title: "FAST Excellence Awards 2025",
    description: "Faculty of Applied Science & Technology awards night.",
    bannerUrl: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=1200&fit=crop",
    location: "Koforidua, Ghana",
    votingStartsAt: new Date("2025-06-15").getTime(),
    votingEndsAt: new Date("2025-12-25").getTime(),
    status: "closed" as const,
  },
  {
    slug: "foe-awards-2025",
    eventCode: "FOE",
    title: "FOE Engineering Awards 2025",
    description: "Celebrating excellence in engineering.",
    bannerUrl: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1200&fit=crop",
    location: "Koforidua, Ghana",
    votingStartsAt: new Date("2025-12-29").getTime(),
    votingEndsAt: new Date("2026-01-01").getTime(),
    status: "closed" as const,
  },
  {
    slug: "fbms-awards-2025",
    eventCode: "FBM",
    title: "FBMS Business Awards 2025",
    description: "Recognizing outstanding business students.",
    bannerUrl: "https://images.unsplash.com/photo-1515169067865-5387ec356754?w=1200&fit=crop",
    location: "Koforidua, Ghana",
    votingStartsAt: new Date("2025-06-15").getTime(),
    votingEndsAt: new Date("2026-12-28").getTime(),
    status: "live" as const,
  },
  {
    slug: "fbne-awards-2025",
    eventCode: "FBN",
    title: "FBNE Innovation Awards 2025",
    description: "Honouring entrepreneurial excellence.",
    bannerUrl: "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=1200&fit=crop",
    location: "Koforidua, Ghana",
    votingStartsAt: new Date("2025-06-15").getTime(),
    votingEndsAt: new Date("2026-12-16").getTime(),
    status: "live" as const,
  },
];

const CATEGORIES_DATA = [
  // FAST
  { eventSlug: "fast-awards-2025", code: "SOY",  name: "FAST Student of the Year",   description: "Overall best student in FAST."                         },
  { eventSlug: "fast-awards-2025", code: "BP",   name: "Best Programmer",              description: "Outstanding coding skills and innovation."             },
  { eventSlug: "fast-awards-2025", code: "BUD",  name: "Best UI/UX Designer",          description: "Excellence in user interface & experience design."     },
  { eventSlug: "fast-awards-2025", code: "BMAD", name: "Best Mobile App Developer",    description: "Top mobile application developer."                     },
  { eventSlug: "fast-awards-2025", code: "BRS",  name: "Best Research Student",        description: "Outstanding academic and research performance."        },
  { eventSlug: "fast-awards-2025", code: "TIA",  name: "Tech Innovator Award",         description: "Student with innovative tech solutions."               },
  { eventSlug: "fast-awards-2025", code: "MPS",  name: "Most Popular Student",         description: "Most loved student in FAST."                           },
  { eventSlug: "fast-awards-2025", code: "BSL",  name: "Best Student Leader",          description: "Excellence in leadership and service."                 },
  // FOE
  { eventSlug: "foe-awards-2025",  code: "SOY",  name: "FOE Student of the Year",     description: "Overall best engineering student."                     },
  { eventSlug: "foe-awards-2025",  code: "BCE",  name: "Best Civil Engineering",       description: "Top civil engineering student."                        },
  { eventSlug: "foe-awards-2025",  code: "BEE",  name: "Best Electrical Engineering",  description: "Excellence in electrical engineering."                 },
  { eventSlug: "foe-awards-2025",  code: "BME",  name: "Best Mechanical Engineering",  description: "Excellence in mechanical engineering."                 },
  // FBMS
  { eventSlug: "fbms-awards-2025", code: "SOY",  name: "FBMS Student of the Year",    description: "Overall best business student."                        },
  { eventSlug: "fbms-awards-2025", code: "BE",   name: "Best Entrepreneur",            description: "Outstanding entrepreneurial spirit and initiative."    },
  { eventSlug: "fbms-awards-2025", code: "BFS",  name: "Best Finance Student",         description: "Excellence in finance and accounting."                 },
  // FBNE
  { eventSlug: "fbne-awards-2025", code: "SOY",  name: "FBNE Student of the Year",    description: "Overall best student in FBNE."                         },
  { eventSlug: "fbne-awards-2025", code: "IC",   name: "Innovation Champion",          description: "Most innovative student of the year."                  },
  { eventSlug: "fbne-awards-2025", code: "LE",   name: "Leadership Excellence",        description: "Outstanding leadership and community impact."          },
];

// Each entry is one category's nominees
const NOMINEES_DATA = [
  // FAST
  { eventSlug: "fast-awards-2025", categoryCode: "SOY",  prefix: "FA-SOY",  names: ["Kwame Boateng","Abigail Owusu","Samuel Mensah","Esther Boadu","Daniel Ofori","Linda Asare"] },
  { eventSlug: "fast-awards-2025", categoryCode: "BP",   prefix: "FA-BP",   names: ["Michael Addo","Felix Amoah","Priscilla Darko","John Asiedu","Bernard Opoku","Nancy Serwaa"] },
  { eventSlug: "fast-awards-2025", categoryCode: "BUD",  prefix: "FA-BUD",  names: ["Abena Kusi","Eric Boateng","Sandra Osei","Kelvin Arthur","Mercy Aidoo","Frank Antwi"] },
  { eventSlug: "fast-awards-2025", categoryCode: "BMAD", prefix: "FA-BMAD", names: ["Isaac Ofori","Patricia Owusu","Kojo Bentil","Vivian Mensah","David Nyame","Angela Boateng"] },
  { eventSlug: "fast-awards-2025", categoryCode: "BRS",  prefix: "FA-BRS",  names: ["Nathaniel Agyemang","Comfort Serwaa","Paul Anane","Rita Frimpong","Godfred Sackey","Naomi Danso"] },
  { eventSlug: "fast-awards-2025", categoryCode: "TIA",  prefix: "FA-TIA",  names: ["Emmanuel Nyarko","Akosua Wiredu","Bright Agyapong","Faith Lamptey","Kenneth Quartey","Joana Koomson"] },
  { eventSlug: "fast-awards-2025", categoryCode: "MPS",  prefix: "FA-MPS",  names: ["Patrick Asamoah","Sandra Adu","Caleb Osei","Florence Badu","Nicholas Tutu","Evelyn Ofori"] },
  { eventSlug: "fast-awards-2025", categoryCode: "BSL",  prefix: "FA-BSL",  names: ["Isaiah Amponsah","Linda Boamah","Andrew Owusu","Joyce Baah","Martin Asare","Victoria Akoto"] },
  // FOE
  { eventSlug: "foe-awards-2025",  categoryCode: "SOY",  prefix: "FOE-SOY", names: ["Joseph Antwi","Linda Asare","Michael Asiedu","Sandra Ofori","Daniel Quaye","Ruth Mensah"] },
  { eventSlug: "foe-awards-2025",  categoryCode: "BCE",  prefix: "FOE-BCE", names: ["Yaw Agyeman","Grace Osei","Paul Owusu","Eunice Baffour","Isaac Tetteh","Veronica Mensah"] },
  { eventSlug: "foe-awards-2025",  categoryCode: "BEE",  prefix: "FOE-BEE", names: ["Kofi Mensah","Ama Darko","Eric Boadi","Diana Asante","George Frimpong","Helen Nkrumah"] },
  { eventSlug: "foe-awards-2025",  categoryCode: "BME",  prefix: "FOE-BME", names: ["Kweku Owusu","Adwoa Amponsah","Samuel Ackah","Grace Ntim","Fiifi Asare","Serwaah Boateng"] },
  // FBMS
  { eventSlug: "fbms-awards-2025", categoryCode: "SOY",  prefix: "FBM-SOY", names: ["Adwoa Mensa","Kofi Appiah","Esi Owusu","Emmanuel Boateng","Abena Asante","Richard Ofori"] },
  { eventSlug: "fbms-awards-2025", categoryCode: "BE",   prefix: "FBM-BE",  names: ["Nana Yaw Osei","Maame Serwaa","Kwame Asiedu","Abigail Boadu","Charles Mensah","Cecilia Agyeman"] },
  { eventSlug: "fbms-awards-2025", categoryCode: "BFS",  prefix: "FBM-BFS", names: ["Yaw Attah","Gifty Frimpong","David Adjei","Akua Sarpong","Kwabena Kusi","Efua Tetteh"] },
  // FBNE
  { eventSlug: "fbne-awards-2025", categoryCode: "SOY",  prefix: "FBN-SOY", names: ["Akua Mensah","Patrick Owusu","Sandra Asante","Collins Boateng","Nana Osei","Vida Adjei"] },
  { eventSlug: "fbne-awards-2025", categoryCode: "IC",   prefix: "FBN-IC",  names: ["Mawuli Asante","Joyce Koomson","Prince Nyarko","Christiana Asare","Elvis Boadu","Ramona Oteng"] },
  { eventSlug: "fbne-awards-2025", categoryCode: "LE",   prefix: "FBN-LE",  names: ["Adjoa Frimpong","Isaac Adu","Evelyn Quaye","Solomon Mensah","Beatrice Amoah","Clement Boateng"] },
];

const OUTLETS_DATA = [
  {
    name: "Prestige Craft Co.",
    tagline: "Masterpieces That Define Excellence",
    description: "Award-winning artisans crafting bespoke recognition pieces for Fortune 500 companies and prestigious institutions across Africa",
    location: "De Bernabue",
    rating: 4.98,
    reviews: 847,
    completedOrders: 3420,
    specialties: ["Crystal Awards","Luxury Trophies","Custom Sculptures","LED Integration"],
    phone: "+233241234567",
    whatsapp: "+233241234567",
    website: "https://prestigecraft.gh",
    portfolioImages: [
      "https://images.unsplash.com/photo-1624823183493-ed5832f48f18?w=1200",
      "https://images.unsplash.com/photo-1586995950615-89d3dbcf3a27?w=1200",
      "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=1200",
    ],
    featured: true,
    responseTime: "2 hours",
    yearsExperience: 18,
    clientSatisfaction: 99,
    verified: true,
  },
  {
    name: "Artisan Legacy",
    tagline: "Heritage Meets Innovation",
    description: "Third-generation craftsmen blending traditional techniques with cutting-edge design technology",
    location: "Koforidua, Adweso Market",
    rating: 4.95,
    reviews: 624,
    completedOrders: 2890,
    specialties: ["Wooden Masterpieces","Bronze Casting","Heritage Plaques","Gold Leafing"],
    phone: "+233249876543",
    whatsapp: "+233249876543",
    website: undefined,
    portfolioImages: [
      "https://images.unsplash.com/photo-1606390488566-4f27735d8db7?w=1200",
      "https://images.unsplash.com/photo-1594122230689-45899d9e6f69?w=1200",
      "https://images.unsplash.com/photo-1624823183493-ed5832f48f18?w=1200",
    ],
    featured: true,
    responseTime: "3 hours",
    yearsExperience: 25,
    clientSatisfaction: 98,
    verified: false,
  },
  {
    name: "Victory Forge",
    tagline: "Champions Choose Excellence",
    description: "Elite trophy makers serving international sports federations and corporate giants",
    location: "Poly Junction",
    rating: 4.92,
    reviews: 531,
    completedOrders: 4100,
    specialties: ["Championship Trophies","Medals","3D Crystal","Rapid Production"],
    phone: "+233245557890",
    whatsapp: "+233245557890",
    website: "https://victoryforge.gh",
    portfolioImages: [
      "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=1200",
      "https://images.unsplash.com/photo-1606767143821-485faa994a7b?w=1200",
      "https://images.unsplash.com/photo-1624823183493-ed5832f48f18?w=1200",
    ],
    featured: false,
    responseTime: "4 hours",
    yearsExperience: 12,
    clientSatisfaction: 97,
    verified: true,
  },
];

const GALLERY_DATA = [
  { urls: ["https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&h=800&fit=crop"], category: "Red Carpet",   eventName: "FAST Excellence Awards 2025", university: "KNUST",          description: "Guests arriving at the red carpet",         photographer: "AAN Photography", uploadDate: "2025-06-15", isFeatured: true  },
  { urls: ["https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1200&h=800&fit=crop"], category: "Special Guest", eventName: "FAST Excellence Awards 2025", university: "KNUST",          description: "VIP guests at the entrance",                 photographer: "AAN Photography", uploadDate: "2025-06-15", isFeatured: false },
  { urls: ["https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=1200&h=800&fit=crop"], category: "Award Winner",  eventName: "FOE Engineering Awards 2025", university: "KSTU",           description: "Award winner receiving trophy on stage",     photographer: "Lens Studio",     uploadDate: "2025-12-30", isFeatured: true  },
  { urls: ["https://images.unsplash.com/photo-1540574163026-643ea20ade25?w=1200&h=800&fit=crop","https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=1200&h=800&fit=crop"], category: "Performance",  eventName: "FOE Engineering Awards 2025",  university: "KSTU",           description: "Live stage performance",                    photographer: "Lens Studio",     uploadDate: "2025-12-30", isFeatured: false },
  { urls: ["https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=1200&h=800&fit=crop"], category: "Backstage",    eventName: "FBMS Business Awards 2025",  university: "KOFORIDUA POLY", description: "Behind the scenes preparation",              photographer: "Campus Shots",    uploadDate: "2026-01-15", isFeatured: false },
  { urls: ["https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1200&h=800&fit=crop"], category: "Award Winner",  eventName: "FBMS Business Awards 2025",  university: "KOFORIDUA POLY", description: "Best Entrepreneur award presentation",       photographer: "Campus Shots",    uploadDate: "2026-01-15", isFeatured: true  },
  { urls: ["https://images.unsplash.com/photo-1521791136064-7986c2920216?w=1200&h=800&fit=crop"], category: "Networking",   eventName: "FBNE Innovation Awards 2025", university: "UPSA",           description: "Networking session after the ceremony",      photographer: "AAN Photography", uploadDate: "2026-02-20", isFeatured: false },
  { urls: ["https://images.unsplash.com/photo-1515169067865-5387ec356754?w=1200&h=800&fit=crop"], category: "Red Carpet",   eventName: "FBNE Innovation Awards 2025", university: "UPSA",           description: "Champions walking the red carpet",           photographer: "AAN Photography", uploadDate: "2026-02-20", isFeatured: true  },
];

// ─── Seed mutation ────────────────────────────────────────────────────────────

/**
 * Seeds the database with demo data.
 * Idempotent: skips if the first event slug already exists.
 *
 * Run via the Convex dashboard → Functions → seed:run, or:
 *   npx convex run seed:run
 */
export const run = internalMutation({
  args: {},
  handler: async (ctx) => {
    // ── Idempotency check ──────────────────────────────────────────────────
    const existing = await ctx.db
      .query("events")
      .withIndex("by_slug", (q) => q.eq("slug", "fast-awards-2025"))
      .unique();
    if (existing) {
      return { status: "already_seeded", message: "Seed data already present. Delete events first to re-seed." };
    }

    // ── Platform config ────────────────────────────────────────────────────
    const config = await ctx.db.query("platformConfig").first();
    if (!config) {
      await ctx.db.insert("platformConfig", {
        defaultPlatformCutPercent: 10,
        updatedAt: Date.now(),
      });
    }

    // ── Seed organizer (demo system account — not for login) ──────────────
    const userId = await ctx.db.insert("users", {
      name: "AIMS Achievers Network",
      email: "demo@aims.internal",
    });

    const now = Date.now();
    const organizerId = await ctx.db.insert("organizerProfiles", {
      userId,
      displayName: "AIMS Achievers Network",
      email: "demo@aims.internal",
      role: "organizer",
      status: "active",
      isPasswordDefault: false,
      createdAt: now,
      updatedAt: now,
    });

    // ── Events ────────────────────────────────────────────────────────────
    const eventIdMap: Record<string, string> = {};

    for (const ev of EVENTS_DATA) {
      const id = await ctx.db.insert("events", {
        organizerId,
        title: ev.title,
        slug: ev.slug,
        eventCode: ev.eventCode,
        description: ev.description,
        bannerUrl: ev.bannerUrl,
        location: ev.location,
        votingStartsAt: ev.votingStartsAt,
        votingEndsAt: ev.votingEndsAt,
        eventDate: ev.votingEndsAt,
        status: ev.status,
        votingMode: "standard",
        pricePerVotePesewas: 50,   // GHS 0.50
        platformCutPercent: 10,
        showVotes: true,
        votingOpen: ev.status === "live",
        publicPageVisible: true,
        nominationsOpen: false,
        nominationRequiresAuth: false,
        createdAt: Date.now(),
      });
      eventIdMap[ev.slug] = id;
    }

    // ── Categories ────────────────────────────────────────────────────────
    const categoryIdMap: Record<string, string> = {};

    for (const cat of CATEGORIES_DATA) {
      const eventId = eventIdMap[cat.eventSlug] as any;
      const id = await ctx.db.insert("categories", {
        eventId,
        name: cat.name,
        description: cat.description,
        categoryCode: cat.code,
        allowsNominations: false,
        nomineeSequence: 0,
        createdAt: Date.now(),
      });
      categoryIdMap[`${cat.eventSlug}:${cat.code}`] = id;
    }

    // ── Nominees ──────────────────────────────────────────────────────────
    let totalNominees = 0;

    for (const group of NOMINEES_DATA) {
      const eventId = eventIdMap[group.eventSlug] as any;
      const categoryId = categoryIdMap[`${group.eventSlug}:${group.categoryCode}`] as any;

      for (let i = 0; i < group.names.length; i++) {
        const seq = i + 1;
        const shortcode = `${group.prefix}-${String(seq).padStart(3, "0")}`;

        await ctx.db.insert("nominees", {
          eventId,
          categoryId,
          displayName: group.names[i],
          shortcode,
          avatarUrl: `https://randomuser.me/api/portraits/${i % 2 === 0 ? "men" : "women"}/${20 + i}.jpg`,
          bio: "Outstanding contribution and performance.",
          status: "active",
          totalVotes: Math.floor(Math.random() * 100),
          createdAt: Date.now(),
        });
        totalNominees++;
      }

      // Update nomineeSequence on the category
      await ctx.db.patch(categoryId, { nomineeSequence: group.names.length });
    }

    // ── Outlets ───────────────────────────────────────────────────────────
    for (const outlet of OUTLETS_DATA) {
      await ctx.db.insert("outlets", {
        name: outlet.name,
        tagline: outlet.tagline,
        description: outlet.description,
        location: outlet.location,
        phone: outlet.phone,
        whatsapp: outlet.whatsapp,
        website: outlet.website,
        specialties: outlet.specialties,
        portfolioImages: outlet.portfolioImages,
        rating: outlet.rating,
        reviews: outlet.reviews,
        completedOrders: outlet.completedOrders,
        responseTime: outlet.responseTime,
        yearsExperience: outlet.yearsExperience,
        clientSatisfaction: outlet.clientSatisfaction,
        featured: outlet.featured,
        verified: outlet.verified,
        isPlatformGlobal: true,
        createdAt: Date.now(),
      });
    }

    // ── Gallery ───────────────────────────────────────────────────────────
    for (const photo of GALLERY_DATA) {
      await ctx.db.insert("gallery", {
        urls: photo.urls,
        category: photo.category,
        eventName: photo.eventName,
        university: photo.university,
        description: photo.description,
        photographer: photo.photographer,
        uploadDate: photo.uploadDate,
        isFeatured: photo.isFeatured,
        createdAt: Date.now(),
      });
    }

    return {
      status: "ok",
      events: EVENTS_DATA.length,
      categories: CATEGORIES_DATA.length,
      nominees: totalNominees,
      outlets: OUTLETS_DATA.length,
      gallery: GALLERY_DATA.length,
    };
  },
});

// ─── Ticket-focus demo events ─────────────────────────────────────────────────

// The public listing/detail pages read the event's displayed date range from
// votingStartsAt/votingEndsAt (used as the general "event window" for display,
// not just for voting) — a ticket-focus event still needs these set, even
// though it never opens voting, or getDaysLeft() has nothing to compute from.
const TICKET_FOCUS_EVENTS_DATA = [
  {
    // Far in the future relative to "today" — shows the normal, active state.
    slug: "rooftop-social-night-2026",
    eventCode: "RSN",
    title: "Rooftop Social Night",
    description:
      "A ticketed rooftop evening — good music, good views, no voting or categories. Just a great night out.",
    bannerUrl: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200&fit=crop",
    location: "Koforidua, Ghana",
    eventDate: new Date("2027-06-01").getTime(),
    status: "live" as const,
    ticketTypes: [
      { name: "Free RSVP", description: "Standing room, first come first served.", pricePesewas: 0, quantityTotal: 50 },
      { name: "General Admission", description: "Entry + one welcome drink.", pricePesewas: 2000, quantityTotal: 200 },
      { name: "VIP Table", description: "Reserved table for 4, bottle service included.", pricePesewas: 15000, quantityTotal: 20 },
    ],
  },
  {
    // Already in the past relative to "today" — shows the ended state
    // (0 days left, ticket purchase buttons disabled).
    slug: "sunset-beach-party-2025",
    eventCode: "SBP",
    title: "Sunset Beach Party",
    description:
      "A ticketed beach party — already wrapped. Kept public to show how a past ticket-only event looks.",
    bannerUrl: "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=1200&fit=crop",
    location: "Ada, Ghana",
    eventDate: new Date("2025-12-01").getTime(),
    status: "closed" as const,
    ticketTypes: [
      { name: "General Admission", description: "Entry to the beach party.", pricePesewas: 3000, quantityTotal: 300 },
      { name: "VIP Cabana", description: "Private cabana for up to 6.", pricePesewas: 25000, quantityTotal: 10 },
    ],
  },
];

/**
 * Seeds "ticket-focus" events — ticketingEnabled with zero categories, so the
 * public event-card/detail-page ticket-only rendering has real data to show,
 * across both the active and already-ended states. Run `seed:run` first
 * (this reuses that seed's demo organizer).
 *
 * Safe to re-run: patches the date/status fields on events that already
 * exist (so fixes here take effect) without duplicating their ticket types.
 * Run via: npx convex run seed:seedTicketFocusEvent
 */
export const seedTicketFocusEvent = internalMutation({
  args: {},
  handler: async (ctx) => {
    // Reuses whichever organizer profile already exists (e.g. from seed:run)
    // rather than assuming a specific email — which one owns a demo event
    // doesn't matter here.
    const organizer = await ctx.db.query("organizerProfiles").first();
    if (!organizer) {
      return {
        status: "missing_organizer",
        message: "No organizer profile exists yet — run seed:run first, or create one via the dashboard.",
      };
    }

    const now = Date.now();
    const results: { slug: string; action: "created" | "updated" }[] = [];

    for (const def of TICKET_FOCUS_EVENTS_DATA) {
      const existing = await ctx.db
        .query("events")
        .withIndex("by_slug", (q) => q.eq("slug", def.slug))
        .unique();

      if (existing) {
        await ctx.db.patch(existing._id, {
          votingStartsAt: def.eventDate,
          votingEndsAt: def.eventDate,
          eventDate: def.eventDate,
          status: def.status,
        });
        results.push({ slug: def.slug, action: "updated" });
        continue;
      }

      const eventId = await ctx.db.insert("events", {
        organizerId: organizer._id,
        title: def.title,
        slug: def.slug,
        eventCode: def.eventCode,
        description: def.description,
        bannerUrl: def.bannerUrl,
        location: def.location,
        votingStartsAt: def.eventDate,
        votingEndsAt: def.eventDate,
        eventDate: def.eventDate,
        status: def.status,

        // Voting fields are still required by the schema, but this event
        // never opens voting and creates no categories — see the
        // "ticket-focus" convention: an event with zero categories renders
        // as ticket-only on the public pages regardless of these values.
        votingMode: "standard",
        pricePerVotePesewas: 100,
        platformCutPercent: 10,
        showVotes: false,
        votingOpen: false,
        publicPageVisible: true,
        nominationsOpen: false,
        nominationRequiresAuth: false,

        ticketingEnabled: true,
        createdAt: now,
      });

      for (const tt of def.ticketTypes) {
        await ctx.db.insert("ticketTypes", {
          eventId,
          name: tt.name,
          description: tt.description,
          pricePesewas: tt.pricePesewas,
          quantityTotal: tt.quantityTotal,
          quantitySold: 0,
          isActive: true,
          createdAt: now,
        });
      }

      results.push({ slug: def.slug, action: "created" });
    }

    return { status: "ok", events: results };
  },
});
