export interface Category {
  id: string;
  name: string;
  description: string;
  nomineeCount: number;
}

export interface EventDetail {
  id: string;
  title: string;
  location: string;
  date: string;
  status: string;
  categories: Category[];
}

export const MOCK_EVENT_DETAILS: Record<string, EventDetail> = {
  "evt-1": {
    id: "evt-1",
    title: "FAST Excellence Awards 2025",
    location: "Koforidua, Ghana",
    date: "June 15, 2025",
    status: "live",
    categories: [
      { id: "cat-1", name: "Best Developer",     description: "Most innovative student developer",  nomineeCount: 5  },
      { id: "cat-2", name: "Best Lecturer",       description: "Outstanding teaching excellence",    nomineeCount: 8  },
      { id: "cat-3", name: "Best Final Year",     description: "Most dedicated final year student",  nomineeCount: 12 },
      { id: "cat-4", name: "Most Innovative",     description: "Creative problem solving award",     nomineeCount: 6  },
    ],
  },
  "evt-2": {
    id: "evt-2",
    title: "FOE Engineering Awards 2025",
    location: "Koforidua, Ghana",
    date: "April 20, 2025",
    status: "closed",
    categories: [
      { id: "cat-5", name: "Best Engineer",       description: "Top engineering student of the year", nomineeCount: 10 },
      { id: "cat-6", name: "Best Project",        description: "Outstanding final year project",       nomineeCount: 7  },
    ],
  },
  "evt-3": {
    id: "evt-3",
    title: "FBMS Business Awards 2025",
    location: "Koforidua, Ghana",
    date: "July 10, 2025",
    status: "live",
    categories: [
      { id: "cat-7", name: "Best Entrepreneur",   description: "Most entrepreneurial student",         nomineeCount: 9  },
      { id: "cat-8", name: "Best Marketer",       description: "Top marketing student",                nomineeCount: 6  },
    ],
  },
  "evt-4": {
    id: "evt-4",
    title: "FBNE Innovation Awards 2025",
    location: "Koforidua, Ghana",
    date: "August 5, 2025",
    status: "draft",
    categories: [],
  },
};
