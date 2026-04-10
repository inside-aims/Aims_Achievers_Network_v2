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
  showVotes: boolean;
  votingOpen: boolean;
  publicPage: boolean;
}

export interface EventStats {
  revenue: string;
  totalVotes: number;
  votesThisHour: number;
  price: string;
  closesDate: string;
  totalCategories: number;
  totalNominees: number;
}

export interface RichEventDetail {
  id: string;
  title: string;
  location: string;
  date: string;
  status: string;
  controls: EventControls;
  stats: EventStats;
  categories: CategoryDetail[];
}

export const MOCK_EVENT_DETAILS: Record<string, RichEventDetail> = {
  "evt-1": {
    id: "evt-1",
    title: "FAST Excellence Awards 2025",
    location: "Koforidua, Ghana",
    date: "June 15, 2025",
    status: "live",
    controls: {
      showVotes: true,
      votingOpen: true,
      publicPage: true,
    },
    stats: {
      revenue: "GHS 6,010",
      totalVotes: 6010,
      votesThisHour: 340,
      price: "GHS 1 / vote",
      closesDate: "Jun 15",
      totalCategories: 4,
      totalNominees: 18,
    },
    categories: [
      {
        id: "cat-1",
        name: "Best Developer",
        description: "Most innovative student developer",
        nominees: [
          { id: "n-1", name: "Ada Mensah",    votes: 1840 },
          { id: "n-2", name: "Kofi Boateng",  votes: 1320 },
          { id: "n-3", name: "Ama Osei",      votes: 680  },
          { id: "n-4", name: "Kwame Poku",    votes: 410  },
        ],
      },
      {
        id: "cat-2",
        name: "Best Lecturer",
        description: "Outstanding teaching excellence",
        nominees: [
          { id: "n-5", name: "Prof. K. Owusu",      votes: 890 },
          { id: "n-6", name: "Dr. Mensah-Bonsu",    votes: 540 },
          { id: "n-7", name: "Ms. R. Asante",       votes: 330 },
        ],
      },
      {
        id: "cat-3",
        name: "Best Final Year",
        description: "Most dedicated final year student",
        nominees: [
          { id: "n-8",  name: "James Ofori",     votes: 520 },
          { id: "n-9",  name: "Abena Darko",     votes: 480 },
          { id: "n-10", name: "Nana Boateng",    votes: 310 },
          { id: "n-11", name: "Efua Amponsah",   votes: 210 },
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
    location: "Koforidua, Ghana",
    date: "April 20, 2025",
    status: "closed",
    controls: {
      showVotes: true,
      votingOpen: false,
      publicPage: true,
    },
    stats: {
      revenue: "GHS 3,250",
      totalVotes: 3250,
      votesThisHour: 0,
      price: "GHS 1 / vote",
      closesDate: "Apr 20",
      totalCategories: 2,
      totalNominees: 10,
    },
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
          { id: "n-18", name: "Team AgroTech",   votes: 430 },
          { id: "n-19", name: "Team BioEnergy",  votes: 230 },
        ],
      },
    ],
  },

  "evt-3": {
    id: "evt-3",
    title: "FBMS Business Awards 2025",
    location: "Koforidua, Ghana",
    date: "July 10, 2025",
    status: "live",
    controls: {
      showVotes: false,
      votingOpen: true,
      publicPage: true,
    },
    stats: {
      revenue: "GHS 1,890",
      totalVotes: 1890,
      votesThisHour: 120,
      price: "GHS 1 / vote",
      closesDate: "Jul 10",
      totalCategories: 2,
      totalNominees: 9,
    },
    categories: [
      {
        id: "cat-7",
        name: "Best Entrepreneur",
        description: "Most entrepreneurial student",
        nominees: [
          { id: "n-20", name: "Adwoa Asante",   votes: 620 },
          { id: "n-21", name: "Kwame Bediako",  votes: 510 },
          { id: "n-22", name: "Ama Yeboah",     votes: 340 },
        ],
      },
      {
        id: "cat-8",
        name: "Best Marketer",
        description: "Top marketing student",
        nominees: [
          { id: "n-23", name: "Fiifi Oppong",    votes: 260 },
          { id: "n-24", name: "Nana Ama Boadu",  votes: 160 },
        ],
      },
    ],
  },

  "evt-4": {
    id: "evt-4",
    title: "FBNE Innovation Awards 2025",
    location: "Koforidua, Ghana",
    date: "August 5, 2025",
    status: "draft",
    controls: {
      showVotes: false,
      votingOpen: false,
      publicPage: false,
    },
    stats: {
      revenue: "GHS 0",
      totalVotes: 0,
      votesThisHour: 0,
      price: "GHS 1 / vote",
      closesDate: "Aug 5",
      totalCategories: 0,
      totalNominees: 0,
    },
    categories: [],
  },
};
