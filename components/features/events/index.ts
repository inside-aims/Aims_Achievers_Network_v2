export type EventStatus = "all" | "active" | "past";

export interface NomineeProps {
  nomineeId: string;
  nomineeCode: string;
  fullName: string;
  description: string;
  imageUrl: string;
}

export type EventCategory = {
  id: string;
  name: string;
  description: string;
  votePrice: number;
  nominees?: NomineeProps[];
};

export type EventCardProps = {
  eventId: string;
  title: string;
  description: string;
  image: string;
  startDate: string;
  endDate: string;
  categories: EventCategory[];
};

const createNominees = (
  prefix: string,
  names: string[]
) => names.map((name, index) => ({
  nomineeId: `${prefix}-nom-${index + 1}`,
  nomineeCode: `${prefix.toUpperCase()}-${100 + index}`,
  fullName: name,
  description: `Outstanding contribution and performance.`,
  imageUrl: `https://randomuser.me/api/portraits/${index % 2 === 0 ? "men" : "women"}/${20 + index}.jpg`,
}));


const FAST_CATEGORIES: EventCategory[] = [
  {
    id: "fast-student-of-year",
    name: "FAST Student of the Year",
    description: "Overall best student in FAST.",
    votePrice: 0.5,
    nominees: createNominees("fast-soy", [
      "Kwame Boateng",
      "Abigail Owusu",
      "Samuel Mensah",
      "Esther Boadu",
      "Daniel Ofori",
      "Linda Asare",
      "Yaw Mensah",
      "Grace Nyarko",
    ]),
  },
  {
    id: "fast-best-programmer",
    name: "Best Programmer",
    description: "Outstanding coding skills and innovation.",
    votePrice: 1,
    nominees: createNominees("fast-prog", [
      "Michael Addo",
      "Felix Amoah",
      "Priscilla Darko",
      "John Asiedu",
      "Bernard Opoku",
      "Nancy Serwaa",
      "Elijah Tetteh",
      "Rebecca Mensah",
    ]),
  },
  {
    id: "fast-uiux",
    name: "Best UI/UX Designer",
    description: "Excellence in user interface & experience design.",
    votePrice: 0.5,
    nominees: createNominees("fast-uiux", [
      "Abena Kusi",
      "Eric Boateng",
      "Sandra Osei",
      "Kelvin Arthur",
      "Mercy Aidoo",
      "Frank Antwi",
      "Joyce Appiah",
      "Stephen Adu",
    ]),
  },
  {
    id: "fast-mobile-dev",
    name: "Best Mobile App Developer",
    description: "Top mobile application developer.",
    votePrice: 1,
    nominees: createNominees("fast-mobile", [
      "Isaac Ofori",
      "Patricia Owusu",
      "Kojo Bentil",
      "Vivian Mensah",
      "David Nyame",
      "Angela Boateng",
      "Joseph Adjei",
      "Hannah Amankwah",
    ]),
  },
  {
    id: "fast-research",
    name: "Best Research Student",
    description: "Outstanding academic and research performance.",
    votePrice: 0.5,
    nominees: createNominees("fast-research", [
      "Nathaniel Agyemang",
      "Comfort Serwaa",
      "Paul Anane",
      "Rita Frimpong",
      "Godfred Sackey",
      "Naomi Danso",
      "Prince Adu",
      "Sarah Amofa",
    ]),
  },
  {
    id: "fast-innovator",
    name: "Tech Innovator Award",
    description: "Student with innovative tech solutions.",
    votePrice: 1,
    nominees: createNominees("fast-innovator", [
      "Emmanuel Nyarko",
      "Akosua Wiredu",
      "Bright Agyapong",
      "Faith Lamptey",
      "Kenneth Quartey",
      "Joana Koomson",
      "Richmond Armah",
      "Deborah Sarpong",
    ]),
  },
  {
    id: "fast-most-popular",
    name: "Most Popular Student",
    description: "Most loved student in FAST.",
    votePrice: 0.5,
    nominees: createNominees("fast-popular", [
      "Patrick Asamoah",
      "Sandra Adu",
      "Caleb Osei",
      "Florence Badu",
      "Nicholas Tutu",
      "Evelyn Ofori",
      "Samuel Tetteh",
      "Beatrice Addai",
    ]),
  },
  {
    id: "fast-leadership",
    name: "Best Student Leader",
    description: "Excellence in leadership and service.",
    votePrice: 0.5,
    nominees: createNominees("fast-lead", [
      "Isaiah Amponsah",
      "Linda Boamah",
      "Andrew Owusu",
      "Joyce Baah",
      "Martin Asare",
      "Victoria Akoto",
      "Peter Darkwah",
      "Janet Abena",
    ]),
  },
];

const FOE_CATEGORIES: EventCategory[] = [
  {
    id: "foe-student-year",
    name: "FOE Student of the Year",
    description: "Overall best engineering student.",
    votePrice: 0.5,
    nominees: createNominees("foe-soy", [
      "Joseph Antwi",
      "Linda Asare",
      "Michael Asiedu",
      "Sandra Ofori",
      "Daniel Quaye",
      "Ruth Mensah",
      "Samuel Kusi",
      "Esther Lamptey",
    ]),
  },
  {
    id: "foe-civil",
    name: "Best Civil Engineering Student",
    description: "Top civil engineering student.",
    votePrice: 0.5,
    nominees: createNominees("foe-civil", [
      "Yaw Agyeman",
      "Grace Osei",
      "Paul Owusu",
      "Eunice Baffour",
      "Isaac Tetteh",
      "Veronica Mensah",
      "Henry Nyarko",
      "Sophia Antwi",
    ]),
  },
];

const FBNE_CATEGORIES: EventCategory[] = [
  {
    id: "foe-student-year",
    name: "FOE Student of the Year",
    description: "Overall best engineering student.",
    votePrice: 0.5,
    nominees: createNominees("foe-soy", [
      "Joseph Antwi",
      "Linda Asare",
      "Michael Asiedu",
      "Sandra Ofori",
      "Daniel Quaye",
      "Ruth Mensah",
      "Samuel Kusi",
      "Esther Lamptey",
    ]),
  },
  {
    id: "foe-civil",
    name: "Best Civil Engineering Student",
    description: "Top civil engineering student.",
    votePrice: 0.5,
    nominees: createNominees("foe-civil", [
      "Yaw Agyeman",
      "Grace Osei",
      "Paul Owusu",
      "Eunice Baffour",
      "Isaac Tetteh",
      "Veronica Mensah",
      "Henry Nyarko",
      "Sophia Antwi",
    ]),
  },
];


const FBMS_CATEGORIES: EventCategory[] = [
  {
    id: "foe-student-year",
    name: "FOE Student of the Year",
    description: "Overall best engineering student.",
    votePrice: 0.5,
    nominees: createNominees("foe-soy", [
      "Joseph Antwi",
      "Linda Asare",
      "Michael Asiedu",
      "Sandra Ofori",
      "Daniel Quaye",
      "Ruth Mensah",
      "Samuel Kusi",
      "Esther Lamptey",
    ]),
  },
  {
    id: "foe-civil",
    name: "Best Civil Engineering Student",
    description: "Top civil engineering student.",
    votePrice: 0.5,
    nominees: createNominees("foe-civil", [
      "Yaw Agyeman",
      "Grace Osei",
      "Paul Owusu",
      "Eunice Baffour",
      "Isaac Tetteh",
      "Veronica Mensah",
      "Henry Nyarko",
      "Sophia Antwi",
    ]),
  },
];


export const EVENTS: EventCardProps[] = [
  {
    eventId: "fast-awards-2025",
    title: "FAST Excellence Awards 2025",
    description: "Faculty of Applied Science & Technology awards night.",
    startDate: "2025-06-15",
    endDate: "2025-12-20",
    image:
      "https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=1200&fit=crop",
    categories: FAST_CATEGORIES,
  },
  {
    eventId: "foe-awards-2025",
    title: "FOE Engineering Awards 2025",
    description: "Celebrating excellence in engineering.",
    startDate: "2025-06-15",
    endDate: "2025-12-20",
    image:
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1200&fit=crop",
    categories: FOE_CATEGORIES,
  },
  {
    eventId: "fbms-awards-2025",
    title: "FBMS Business Awards 2025",
    description: "Recognizing outstanding business students.",
    startDate: "2025-06-15",
    endDate: "2025-12-20",
    image:
      "https://images.unsplash.com/photo-1515169067865-5387ec356754?w=1200&fit=crop",
    categories: FBMS_CATEGORIES,
  },
  {
    eventId: "fbne-awards-2025",
    title: "FBNE Innovation Awards 2025",
    description: "Honouring entrepreneurial excellence.",
    startDate: "2025-06-15",
    endDate: "2025-12-16",
    image:
      "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=1200&fit=crop",
    categories: FBNE_CATEGORIES,
  },
];
