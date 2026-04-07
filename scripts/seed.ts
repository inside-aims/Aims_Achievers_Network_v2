// Run with: bun run scripts/seed.ts
// Requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceKey  = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !serviceKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

const db = createClient(supabaseUrl, serviceKey);

// ─── helpers ─────────────────────────────────────────────────────────────────
const makeNominees = (prefix: string, names: string[], categoryId: string, eventId: string) =>
  names.map((name, i) => ({
    nominee_id:   `${categoryId}-nom-${i + 1}`,
    nominee_code: `${prefix.toUpperCase()}-${100 + i}`,
    category_id:  categoryId,
    event_id:     eventId,
    full_name:    name,
    description:  "Outstanding contribution and performance.",
    image_url:    `https://randomuser.me/api/portraits/${i % 2 === 0 ? "men" : "women"}/${20 + i}.jpg`,
    votes:        Math.floor(Math.random() * 100),
    department:   null,
    program:      null,
    year:         null,
    phone:        null,
    is_active:    true,
  }));

// ─── EVENTS ───────────────────────────────────────────────────────────────────
const EVENTS = [
  {
    event_id:    "fast-awards-2025",
    title:       "FAST Excellence Awards 2025",
    description: "Faculty of Applied Science & Technology awards night.",
    image:       "https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=1200&fit=crop",
    start_date:  "2025-06-15",
    end_date:    "2025-12-25",
    location:    "Koforidua, Ghana",
    organizer:   "AIMS Achievers Network",
    is_active:   true,
  },
  {
    event_id:    "foe-awards-2025",
    title:       "FOE Engineering Awards 2025",
    description: "Celebrating excellence in engineering.",
    image:       "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1200&fit=crop",
    start_date:  "2025-12-29",
    end_date:    "2026-01-01",
    location:    "Koforidua, Ghana",
    organizer:   "AIMS Achievers Network",
    is_active:   true,
  },
  {
    event_id:    "fbms-awards-2025",
    title:       "FBMS Business Awards 2025",
    description: "Recognizing outstanding business students.",
    image:       "https://images.unsplash.com/photo-1515169067865-5387ec356754?w=1200&fit=crop",
    start_date:  "2025-06-15",
    end_date:    "2026-12-28",
    location:    "Koforidua, Ghana",
    organizer:   "AIMS Achievers Network",
    is_active:   true,
  },
  {
    event_id:    "fbne-awards-2025",
    title:       "FBNE Innovation Awards 2025",
    description: "Honouring entrepreneurial excellence.",
    image:       "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=1200&fit=crop",
    start_date:  "2025-06-15",
    end_date:    "2026-12-16",
    location:    "Koforidua, Ghana",
    organizer:   "AIMS Achievers Network",
    is_active:   true,
  },
];

// ─── CATEGORIES ───────────────────────────────────────────────────────────────
const CATEGORIES = [
  // FAST
  { category_id: "fast-student-of-year",  event_id: "fast-awards-2025", name: "FAST Student of the Year",  description: "Overall best student in FAST.",                          vote_price: 0.5 },
  { category_id: "fast-best-programmer",  event_id: "fast-awards-2025", name: "Best Programmer",             description: "Outstanding coding skills and innovation.",              vote_price: 1   },
  { category_id: "fast-uiux",             event_id: "fast-awards-2025", name: "Best UI/UX Designer",         description: "Excellence in user interface & experience design.",      vote_price: 0.5 },
  { category_id: "fast-mobile-dev",       event_id: "fast-awards-2025", name: "Best Mobile App Developer",   description: "Top mobile application developer.",                      vote_price: 1   },
  { category_id: "fast-research",         event_id: "fast-awards-2025", name: "Best Research Student",       description: "Outstanding academic and research performance.",         vote_price: 0.5 },
  { category_id: "fast-innovator",        event_id: "fast-awards-2025", name: "Tech Innovator Award",        description: "Student with innovative tech solutions.",                vote_price: 1   },
  { category_id: "fast-most-popular",     event_id: "fast-awards-2025", name: "Most Popular Student",        description: "Most loved student in FAST.",                            vote_price: 0.5 },
  { category_id: "fast-leadership",       event_id: "fast-awards-2025", name: "Best Student Leader",         description: "Excellence in leadership and service.",                  vote_price: 0.5 },
  // FOE
  { category_id: "foe-student-year",      event_id: "foe-awards-2025",  name: "FOE Student of the Year",    description: "Overall best engineering student.",                      vote_price: 0.5 },
  { category_id: "foe-civil",             event_id: "foe-awards-2025",  name: "Best Civil Engineering",     description: "Top civil engineering student.",                         vote_price: 0.5 },
  { category_id: "foe-electrical",        event_id: "foe-awards-2025",  name: "Best Electrical Engineering", description: "Excellence in electrical engineering.",                  vote_price: 0.5 },
  { category_id: "foe-mechanical",        event_id: "foe-awards-2025",  name: "Best Mechanical Engineering", description: "Excellence in mechanical engineering.",                  vote_price: 0.5 },
  // FBMS
  { category_id: "fbms-student-year",     event_id: "fbms-awards-2025", name: "FBMS Student of the Year",   description: "Overall best business student.",                         vote_price: 0.5 },
  { category_id: "fbms-entrepreneur",     event_id: "fbms-awards-2025", name: "Best Entrepreneur",           description: "Outstanding entrepreneurial spirit and initiative.",     vote_price: 1   },
  { category_id: "fbms-finance",          event_id: "fbms-awards-2025", name: "Best Finance Student",        description: "Excellence in finance and accounting.",                  vote_price: 0.5 },
  // FBNE
  { category_id: "fbne-student-year",     event_id: "fbne-awards-2025", name: "FBNE Student of the Year",   description: "Overall best student in FBNE.",                          vote_price: 0.5 },
  { category_id: "fbne-innovator",        event_id: "fbne-awards-2025", name: "Innovation Champion",         description: "Most innovative student of the year.",                   vote_price: 1   },
  { category_id: "fbne-leadership",       event_id: "fbne-awards-2025", name: "Leadership Excellence",       description: "Outstanding leadership and community impact.",           vote_price: 0.5 },
].map((c) => ({ ...c, is_active: true }));

// ─── NOMINEES ────────────────────────────────────────────────────────────────
const NOMINEES = [
  // FAST — Student of Year
  ...makeNominees("fast-soy", ["Kwame Boateng","Abigail Owusu","Samuel Mensah","Esther Boadu","Daniel Ofori","Linda Asare"], "fast-student-of-year", "fast-awards-2025"),
  // FAST — Programmer
  ...makeNominees("fast-prog", ["Michael Addo","Felix Amoah","Priscilla Darko","John Asiedu","Bernard Opoku","Nancy Serwaa"], "fast-best-programmer", "fast-awards-2025"),
  // FAST — UI/UX
  ...makeNominees("fast-uiux", ["Abena Kusi","Eric Boateng","Sandra Osei","Kelvin Arthur","Mercy Aidoo","Frank Antwi"], "fast-uiux", "fast-awards-2025"),
  // FAST — Mobile Dev
  ...makeNominees("fast-mob", ["Isaac Ofori","Patricia Owusu","Kojo Bentil","Vivian Mensah","David Nyame","Angela Boateng"], "fast-mobile-dev", "fast-awards-2025"),
  // FAST — Research
  ...makeNominees("fast-res", ["Nathaniel Agyemang","Comfort Serwaa","Paul Anane","Rita Frimpong","Godfred Sackey","Naomi Danso"], "fast-research", "fast-awards-2025"),
  // FAST — Innovator
  ...makeNominees("fast-inv", ["Emmanuel Nyarko","Akosua Wiredu","Bright Agyapong","Faith Lamptey","Kenneth Quartey","Joana Koomson"], "fast-innovator", "fast-awards-2025"),
  // FAST — Most Popular
  ...makeNominees("fast-pop", ["Patrick Asamoah","Sandra Adu","Caleb Osei","Florence Badu","Nicholas Tutu","Evelyn Ofori"], "fast-most-popular", "fast-awards-2025"),
  // FAST — Leadership
  ...makeNominees("fast-lead", ["Isaiah Amponsah","Linda Boamah","Andrew Owusu","Joyce Baah","Martin Asare","Victoria Akoto"], "fast-leadership", "fast-awards-2025"),
  // FOE — Student of Year
  ...makeNominees("foe-soy", ["Joseph Antwi","Linda Asare","Michael Asiedu","Sandra Ofori","Daniel Quaye","Ruth Mensah"], "foe-student-year", "foe-awards-2025"),
  // FOE — Civil
  ...makeNominees("foe-civ", ["Yaw Agyeman","Grace Osei","Paul Owusu","Eunice Baffour","Isaac Tetteh","Veronica Mensah"], "foe-civil", "foe-awards-2025"),
  // FOE — Electrical
  ...makeNominees("foe-elec", ["Kofi Mensah","Ama Darko","Eric Boadi","Diana Asante","George Frimpong","Helen Nkrumah"], "foe-electrical", "foe-awards-2025"),
  // FOE — Mechanical
  ...makeNominees("foe-mech", ["Kweku Owusu","Adwoa Amponsah","Samuel Ackah","Grace Ntim","Fiifi Asare","Serwaah Boateng"], "foe-mechanical", "foe-awards-2025"),
  // FBMS — Student of Year
  ...makeNominees("fbms-soy", ["Adwoa Mensa","Kofi Appiah","Esi Owusu","Emmanuel Boateng","Abena Asante","Richard Ofori"], "fbms-student-year", "fbms-awards-2025"),
  // FBMS — Entrepreneur
  ...makeNominees("fbms-ent", ["Nana Yaw Osei","Maame Serwaa","Kwame Asiedu","Abigail Boadu","Charles Mensah","Cecilia Agyeman"], "fbms-entrepreneur", "fbms-awards-2025"),
  // FBMS — Finance
  ...makeNominees("fbms-fin", ["Yaw Attah","Gifty Frimpong","David Adjei","Akua Sarpong","Kwabena Kusi","Efua Tetteh"], "fbms-finance", "fbms-awards-2025"),
  // FBNE — Student of Year
  ...makeNominees("fbne-soy", ["Akua Mensah","Patrick Owusu","Sandra Asante","Collins Boateng","Nana Osei","Vida Adjei"], "fbne-student-year", "fbne-awards-2025"),
  // FBNE — Innovator
  ...makeNominees("fbne-inv", ["Mawuli Asante","Joyce Koomson","Prince Nyarko","Christiana Asare","Elvis Boadu","Ramona Oteng"], "fbne-innovator", "fbne-awards-2025"),
  // FBNE — Leadership
  ...makeNominees("fbne-lead", ["Adjoa Frimpong","Isaac Adu","Evelyn Quaye","Solomon Mensah","Beatrice Amoah","Clement Boateng"], "fbne-leadership", "fbne-awards-2025"),
];

// ─── GALLERY ──────────────────────────────────────────────────────────────────
const GALLERY = [
  { urls: ["https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&h=800&fit=crop"], category: "Red Carpet",    event_name: "FAST Excellence Awards 2025", university: "KNUST",           description: "Guests arriving at the red carpet",          photographer: "AAN Photography", upload_date: "2025-06-15", is_featured: true  },
  { urls: ["https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1200&h=800&fit=crop"], category: "Special Guest",  event_name: "FAST Excellence Awards 2025", university: "KNUST",           description: "VIP guests at the entrance",                  photographer: "AAN Photography", upload_date: "2025-06-15", is_featured: false },
  { urls: ["https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=1200&h=800&fit=crop"], category: "Award Winner",   event_name: "FOE Engineering Awards 2025",  university: "KSTU",            description: "Award winner receiving trophy on stage",      photographer: "Lens Studio",     upload_date: "2025-12-30", is_featured: true  },
  { urls: ["https://images.unsplash.com/photo-1540574163026-643ea20ade25?w=1200&h=800&fit=crop","https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=1200&h=800&fit=crop"], category: "Performance", event_name: "FOE Engineering Awards 2025", university: "KSTU", description: "Live stage performance", photographer: "Lens Studio", upload_date: "2025-12-30", is_featured: false },
  { urls: ["https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=1200&h=800&fit=crop"], category: "Backstage",     event_name: "FBMS Business Awards 2025",   university: "KOFORIDUA POLY",  description: "Behind the scenes preparation",               photographer: "Campus Shots",    upload_date: "2026-01-15", is_featured: false },
  { urls: ["https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1200&h=800&fit=crop"], category: "Award Winner",  event_name: "FBMS Business Awards 2025",   university: "KOFORIDUA POLY",  description: "Best Entrepreneur award presentation",        photographer: "Campus Shots",    upload_date: "2026-01-15", is_featured: true  },
  { urls: ["https://images.unsplash.com/photo-1521791136064-7986c2920216?w=1200&h=800&fit=crop"], category: "Networking",    event_name: "FBNE Innovation Awards 2025", university: "UPSA",            description: "Networking session after the ceremony",       photographer: "AAN Photography", upload_date: "2026-02-20", is_featured: false },
  { urls: ["https://images.unsplash.com/photo-1515169067865-5387ec356754?w=1200&h=800&fit=crop"], category: "Red Carpet",    event_name: "FBNE Innovation Awards 2025", university: "UPSA",            description: "Champions walking the red carpet",            photographer: "AAN Photography", upload_date: "2026-02-20", is_featured: true  },
];

// ─── OUTLETS ─────────────────────────────────────────────────────────────────
const OUTLETS = [
  {
    name: "Prestige Craft Co.", tagline: "Masterpieces That Define Excellence",
    description: "Award-winning artisans crafting bespoke recognition pieces for Fortune 500 companies and prestigious institutions across Africa",
    location: "De Bernabue", rating: 4.98, reviews: 847, completed_orders: 3420,
    specialties: ["Crystal Awards","Luxury Trophies","Custom Sculptures","LED Integration"],
    phone: "+233241234567", whatsapp: "+233241234567", website: "https://prestigecraft.gh",
    portfolio_images: ["https://images.unsplash.com/photo-1624823183493-ed5832f48f18?w=1200","https://images.unsplash.com/photo-1586995950615-89d3dbcf3a27?w=1200","https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=1200"],
    featured: true, response_time: "2 hours", years_experience: 18, client_satisfaction: 99, verified: true, is_active: true,
  },
  {
    name: "Artisan Legacy", tagline: "Heritage Meets Innovation",
    description: "Third-generation craftsmen blending traditional techniques with cutting-edge design technology",
    location: "Koforidua, Adweso Market", rating: 4.95, reviews: 624, completed_orders: 2890,
    specialties: ["Wooden Masterpieces","Bronze Casting","Heritage Plaques","Gold Leafing"],
    phone: "+233249876543", whatsapp: "+233249876543", website: null,
    portfolio_images: ["https://images.unsplash.com/photo-1606390488566-4f27735d8db7?w=1200","https://images.unsplash.com/photo-1594122230689-45899d9e6f69?w=1200","https://images.unsplash.com/photo-1624823183493-ed5832f48f18?w=1200"],
    featured: true, response_time: "3 hours", years_experience: 25, client_satisfaction: 98, verified: false, is_active: true,
  },
  {
    name: "Victory Forge", tagline: "Champions Choose Excellence",
    description: "Elite trophy makers serving international sports federations and corporate giants",
    location: "Poly Junction", rating: 4.92, reviews: 531, completed_orders: 4100,
    specialties: ["Championship Trophies","Medals","3D Crystal","Rapid Production"],
    phone: "+233245557890", whatsapp: "+233245557890", website: "https://victoryforge.gh",
    portfolio_images: ["https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=1200","https://images.unsplash.com/photo-1606767143821-485faa994a7b?w=1200","https://images.unsplash.com/photo-1624823183493-ed5832f48f18?w=1200"],
    featured: false, response_time: "4 hours", years_experience: 12, client_satisfaction: 97, verified: true, is_active: true,
  },
];

// ─── SEED RUNNER ─────────────────────────────────────────────────────────────
async function seed() {
  console.log("🌱 Starting seed...\n");

  // Clear in reverse dependency order
  console.log("🗑  Clearing existing seed data...");
  await db.from("nominees").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  await db.from("nominations").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  await db.from("event_categories").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  await db.from("events").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  await db.from("gallery").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  await db.from("outlets").delete().neq("id", "00000000-0000-0000-0000-000000000000");

  // Seed events
  console.log("📅 Seeding events...");
  const { error: evErr } = await db.from("events").insert(EVENTS);
  if (evErr) { console.error("Events error:", evErr.message); process.exit(1); }
  console.log(`   ✓ ${EVENTS.length} events`);

  // Seed categories
  console.log("📂 Seeding categories...");
  const { error: catErr } = await db.from("event_categories").insert(CATEGORIES);
  if (catErr) { console.error("Categories error:", catErr.message); process.exit(1); }
  console.log(`   ✓ ${CATEGORIES.length} categories`);

  // Seed nominees in batches
  console.log("👤 Seeding nominees...");
  const BATCH = 50;
  for (let i = 0; i < NOMINEES.length; i += BATCH) {
    const { error: nomErr } = await db.from("nominees").insert(NOMINEES.slice(i, i + BATCH));
    if (nomErr) { console.error("Nominees error:", nomErr.message); process.exit(1); }
  }
  console.log(`   ✓ ${NOMINEES.length} nominees`);

  // Seed gallery
  console.log("🖼  Seeding gallery...");
  const { error: galErr } = await db.from("gallery").insert(GALLERY);
  if (galErr) { console.error("Gallery error:", galErr.message); process.exit(1); }
  console.log(`   ✓ ${GALLERY.length} gallery items`);

  // Seed outlets
  console.log("🏪 Seeding outlets...");
  const { error: outErr } = await db.from("outlets").insert(OUTLETS);
  if (outErr) { console.error("Outlets error:", outErr.message); process.exit(1); }
  console.log(`   ✓ ${OUTLETS.length} outlets`);

  console.log("\n✅ Seed complete!");
}

seed().catch(console.error);
