import { CalendarDays, Users, BarChart3, TrendingUp } from "lucide-react";

export const PLATFORM_COMMISSION = 0.10;

// ─── Base data ─────────────────────────────────────────────────────────────────

export type OrganizerStatus = "active" | "suspended";

export interface Organizer {
  id:         string;
  name:       string;
  email:      string;
  phone:      string;
  joinedAt:   string;
  status:     OrganizerStatus;
}

export const ADMIN_ORGANIZERS: Organizer[] = [
  { id: "org-1", name: "Kwame Mensah",  email: "kwame.mensah@ktu.edu.gh",   phone: "0244001122", joinedAt: "2024-09-15", status: "active"    },
  { id: "org-2", name: "Ama Boateng",   email: "ama.boateng@knust.edu.gh",   phone: "0551234567", joinedAt: "2024-11-02", status: "active"    },
  { id: "org-3", name: "Kofi Asante",   email: "kofi.asante@ug.edu.gh",      phone: "0207890123", joinedAt: "2025-01-18", status: "active"    },
  { id: "org-4", name: "Abena Darko",   email: "abena.darko@ucc.edu.gh",     phone: "0277334455", joinedAt: "2025-02-08", status: "active"    },
  { id: "org-5", name: "Yaw Frimpong",  email: "yaw.frimpong@gimpa.edu.gh",  phone: "0244556677", joinedAt: "2025-03-01", status: "suspended" },
];

export interface AdminEvent {
  id:        string;
  title:     string;
  orgId:     string;
  status:    string;
  date:      string;
  votes:     number;
  revenue:   number; // GHS
}

export const ADMIN_EVENTS: AdminEvent[] = [
  { id: "evt-1", title: "FAST Excellence Awards 2025",  orgId: "org-1", status: "live",   date: "2025-06-15", votes: 4250, revenue: 4250 },
  { id: "evt-2", title: "FOE Engineering Awards 2025",  orgId: "org-2", status: "closed", date: "2025-04-20", votes: 2590, revenue: 2590 },
  { id: "evt-3", title: "FBMS Business Awards 2025",    orgId: "org-3", status: "live",   date: "2025-07-10", votes: 1770, revenue: 1770 },
  { id: "evt-4", title: "FBNE Innovation Awards 2025",  orgId: "org-4", status: "draft",  date: "2025-08-05", votes: 0,    revenue: 0    },
];

// ─── Derived helpers (single source of truth) ─────────────────────────────────

export function getOrganizerById(id: string): Organizer | undefined {
  return ADMIN_ORGANIZERS.find((o) => o.id === id);
}

export function getEventsByOrg(orgId: string): AdminEvent[] {
  return ADMIN_EVENTS.filter((e) => e.orgId === orgId);
}

export function getOrgStats(orgId: string) {
  const events  = getEventsByOrg(orgId);
  const votes   = events.reduce((s, e) => s + e.votes, 0);
  const revenue = events.reduce((s, e) => s + e.revenue, 0);
  return { events: events.length, votes, revenue };
}

export function getPlatformSummary() {
  const totalVotes   = ADMIN_EVENTS.reduce((s, e) => s + e.votes, 0);
  const totalRevenue = ADMIN_EVENTS.reduce((s, e) => s + e.revenue, 0);
  const platformCut  = Math.round(totalRevenue * PLATFORM_COMMISSION);
  const liveEvents   = ADMIN_EVENTS.filter((e) => e.status === "live").length;
  const activeOrgs   = ADMIN_ORGANIZERS.filter((o) => o.status === "active").length;

  return {
    totalEvents:     ADMIN_EVENTS.length,
    liveEvents,
    totalOrganizers: ADMIN_ORGANIZERS.length,
    activeOrgs,
    totalVotes,
    totalRevenue,
    platformCut,
    avgRevenue:      ADMIN_EVENTS.length > 0 ? Math.round(totalRevenue / ADMIN_EVENTS.length) : 0,
  };
}

export function getAdminStatCards(base: string) {
  const s = getPlatformSummary();
  return [
    {
      label: "Total Events",
      value: s.totalEvents,
      sub:   `${s.liveEvents} live right now`,
      icon:  CalendarDays,
      href:  `${base}/events`,
    },
    {
      label: "Organizers",
      value: s.totalOrganizers,
      sub:   `${s.activeOrgs} active`,
      icon:  Users,
      href:  `${base}/organizers`,
    },
    {
      label: "Votes Cast",
      value: s.totalVotes.toLocaleString(),
      sub:   "Across all events",
      icon:  BarChart3,
      href:  `${base}/analytics`,
    },
    {
      label: "Platform Revenue",
      value: `GHS ${s.platformCut.toLocaleString()}`,
      sub:   `${(PLATFORM_COMMISSION * 100).toFixed(0)}% of GHS ${s.totalRevenue.toLocaleString()}`,
      icon:  TrendingUp,
      href:  `${base}/analytics`,
    },
  ];
}

// ─── Monthly trend (illustrative — not derived from events above) ──────────────

export interface MonthlyPoint {
  month:   string;
  revenue: number;
  votes:   number;
}

export const MONTHLY_TREND: MonthlyPoint[] = [
  { month: "Nov 2024", revenue: 820,  votes: 820  },
  { month: "Dec 2024", revenue: 1240, votes: 1240 },
  { month: "Jan 2025", revenue: 1580, votes: 1580 },
  { month: "Feb 2025", revenue: 2100, votes: 2100 },
  { month: "Mar 2025", revenue: 3460, votes: 3460 },
  { month: "Apr 2025", revenue: 4830, votes: 4610 },
];
