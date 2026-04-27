export interface Nominee {
  id: string;
  name: string;
  votes: number;
}

export interface CategoryDetail {
  id: string;
  name: string;
  description: string;
  nominees: Nominee[];
}

export interface EventControls {
  showVotes:              boolean;
  votingOpen:             boolean;
  publicPage:             boolean;
  nominationsOpen:        boolean;
  autoPublishNominations: boolean;
}

export interface RichEventDetail {
  id: string;
  title: string;
  institution: string;
  description: string;
  location: string;
  date: string;
  status: string;
  currency: string;
  pricePerVote: number;
  closesDate: string;
  votesThisHour: number;
  createdAt: string;
  controls: EventControls;
  categories: CategoryDetail[];
  ticketingEnabled?: boolean;
  ticketEventId?: string; // links to EVENT_TICKET_INFO key e.g. "fast-awards-2025"
  eventTime?: string;     // e.g. "7:00 PM"
}

export interface ComputedStats {
  totalVotes: number;
  totalCategories: number;
  totalNominees: number;
  revenueRaw: number;
  revenue: string;
  priceLabel: string;
}

export function formatCurrency(amount: number, currency: string): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    currencyDisplay: "code",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function computeStats(event: RichEventDetail): ComputedStats {
  const totalCategories = event.categories.length;
  const totalNominees = event.categories.reduce(
    (sum, cat) => sum + cat.nominees.length,
    0
  );
  const totalVotes = event.categories.reduce(
    (sum, cat) => sum + cat.nominees.reduce((s, n) => s + n.votes, 0),
    0
  );
  const revenueRaw = totalVotes * event.pricePerVote;
  const revenue = formatCurrency(revenueRaw, event.currency);
  const priceLabel = `${formatCurrency(event.pricePerVote, event.currency)} / vote`;

  return { totalVotes, totalCategories, totalNominees, revenueRaw, revenue, priceLabel };
}

export const MOCK_EVENT_DETAILS: Record<string, RichEventDetail> = {
  "evt-1": {
    id: "evt-1",
    title: "FAST Excellence Awards 2025",
    institution: "Koforidua Technical University",
    description: "Annual awards recognising outstanding achievements in science, technology and innovation among students and faculty.",
    location: "Koforidua, Ghana",
    date: "2025-06-15",
    status: "live",
    currency: "GHS",
    pricePerVote: 1,
    closesDate: "2025-06-08",
    votesThisHour: 340,
    createdAt: "2025-01-10T08:30:00Z",
    ticketingEnabled: true,
    ticketEventId: "fast-awards-2025",
    eventTime: "7:00 PM",
    controls: { showVotes: true, votingOpen: true, publicPage: true, nominationsOpen: true, autoPublishNominations: false },
    categories: [
      {
        id: "cat-1",
        name: "Best Developer",
        description: "Most innovative student developer",
        nominees: [
          { id: "n-1", name: "Ada Mensah",   votes: 1840 },
          { id: "n-2", name: "Kofi Boateng", votes: 1320 },
          { id: "n-3", name: "Ama Osei",     votes: 680  },
          { id: "n-4", name: "Kwame Poku",   votes: 410  },
        ],
      },
      {
        id: "cat-2",
        name: "Best Lecturer",
        description: "Outstanding teaching excellence",
        nominees: [
          { id: "n-5", name: "Prof. K. Owusu",   votes: 890 },
          { id: "n-6", name: "Dr. Mensah-Bonsu", votes: 540 },
          { id: "n-7", name: "Ms. R. Asante",    votes: 330 },
        ],
      },
      {
        id: "cat-3",
        name: "Best Final Year",
        description: "Most dedicated final year student",
        nominees: [
          { id: "n-8",  name: "James Ofori",   votes: 520 },
          { id: "n-9",  name: "Abena Darko",   votes: 480 },
          { id: "n-10", name: "Nana Boateng",  votes: 310 },
          { id: "n-11", name: "Efua Amponsah", votes: 210 },
        ],
      },
      {
        id: "cat-4",
        name: "Most Innovative",
        description: "Creative problem solving award",
        nominees: [
          { id: "n-12", name: "Kweku Acheampong", votes: 740 },
          { id: "n-13", name: "Serwa Boateng",    votes: 620 },
          { id: "n-14", name: "Kojo Antwi",       votes: 390 },
        ],
      },
    ],
  },

  "evt-2": {
    id: "evt-2",
    title: "FOE Engineering Awards 2025",
    institution: "Kwame Nkrumah University of Science and Technology",
    description: "Celebrating excellence in engineering education, project work and student leadership within the Faculty of Engineering.",
    location: "Kumasi, Ghana",
    date: "2025-04-20",
    status: "closed",
    currency: "GHS",
    pricePerVote: 1,
    closesDate: "2025-04-13",
    votesThisHour: 0,
    createdAt: "2024-12-05T11:00:00Z",
    ticketingEnabled: false,
    controls: { showVotes: true, votingOpen: false, publicPage: true, nominationsOpen: false, autoPublishNominations: false },
    categories: [
      {
        id: "cat-5",
        name: "Best Engineer",
        description: "Top engineering student of the year",
        nominees: [
          { id: "n-15", name: "Yaw Darko",       votes: 1100 },
          { id: "n-16", name: "Akosua Frempong", votes: 870  },
          { id: "n-17", name: "Kofi Mensah",     votes: 620  },
        ],
      },
      {
        id: "cat-6",
        name: "Best Project",
        description: "Outstanding final year project",
        nominees: [
          { id: "n-18", name: "Team AgroTech",  votes: 430 },
          { id: "n-19", name: "Team BioEnergy", votes: 230 },
        ],
      },
    ],
  },

  "evt-3": {
    id: "evt-3",
    title: "FBMS Business Awards 2025",
    institution: "University of Ghana, Legon",
    description: "Honouring the brightest minds in entrepreneurship, marketing and business leadership across the faculty.",
    location: "Accra, Ghana",
    date: "2025-07-10",
    status: "live",
    currency: "GHS",
    pricePerVote: 1,
    closesDate: "2025-07-03",
    votesThisHour: 120,
    createdAt: "2025-02-20T14:15:00Z",
    ticketingEnabled: false,
    controls: { showVotes: false, votingOpen: true, publicPage: true, nominationsOpen: true, autoPublishNominations: false },
    categories: [
      {
        id: "cat-7",
        name: "Best Entrepreneur",
        description: "Most entrepreneurial student",
        nominees: [
          { id: "n-20", name: "Adwoa Asante",  votes: 620 },
          { id: "n-21", name: "Kwame Bediako", votes: 510 },
          { id: "n-22", name: "Ama Yeboah",    votes: 340 },
        ],
      },
      {
        id: "cat-8",
        name: "Best Marketer",
        description: "Top marketing student",
        nominees: [
          { id: "n-23", name: "Fiifi Oppong",   votes: 260 },
          { id: "n-24", name: "Nana Ama Boadu", votes: 160 },
        ],
      },
    ],
  },

  "evt-4": {
    id: "evt-4",
    title: "FBNE Innovation Awards 2025",
    institution: "University of Cape Coast",
    description: "Recognising groundbreaking ideas and innovation from students across the Faculty of Business and Natural Environment.",
    location: "Cape Coast, Ghana",
    date: "2025-08-05",
    status: "draft",
    currency: "GHS",
    pricePerVote: 1,
    closesDate: "2025-07-29",
    votesThisHour: 0,
    createdAt: "2025-03-18T09:45:00Z",
    ticketingEnabled: true,
    ticketEventId: "fbne-awards-2025",
    eventTime: "6:30 PM",
    controls: { showVotes: false, votingOpen: false, publicPage: false, nominationsOpen: false, autoPublishNominations: false },
    categories: [],
  },
};
