import { internalMutation } from "./_generated/server";

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

    // ── Seed organizer (system account) ───────────────────────────────────
    const userId = await ctx.db.insert("users", {
      name: "AIMS Achievers Network",
      email: "admin@aims.internal",
    });

    const organizerId = await ctx.db.insert("organizerProfiles", {
      userId,
      displayName: "AIMS Achievers Network",
      role: "organizer",
      createdAt: Date.now(),
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
