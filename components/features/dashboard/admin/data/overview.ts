import { CalendarDays, Users, BarChart3, TrendingUp } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface StatConfig {
  label: string;
  value: string;
  sub: string;
  icon: LucideIcon;
  routeKey: string;
}

export interface RecentEvent {
  id: string;
  title: string;
  organizer: string;
  status: string;
}

export const ADMIN_STATS: StatConfig[] = [
  { label: "Total Events",     value: "12",          sub: "All time",          icon: CalendarDays, routeKey: "events"     },
  { label: "Organizers",       value: "8",           sub: "Active accounts",   icon: Users,        routeKey: "organizers" },
  { label: "Votes Cast",       value: "48,320",      sub: "Across all events", icon: BarChart3,    routeKey: "analytics"  },
  { label: "Platform Revenue", value: "GHS 9,664",   sub: "10% platform cut",  icon: TrendingUp,   routeKey: "analytics"  },
];

export const ADMIN_RECENT_EVENTS: RecentEvent[] = [
  { id: "evt-1", title: "FAST Excellence Awards 2025", organizer: "Kwame Mensah", status: "live"   },
  { id: "evt-2", title: "FOE Engineering Awards 2025", organizer: "Ama Boateng",  status: "closed" },
  { id: "evt-3", title: "FBMS Business Awards 2025",   organizer: "Kofi Asante",  status: "live"   },
  { id: "evt-4", title: "FBNE Innovation Awards 2025", organizer: "Abena Darko",  status: "draft"  },
];
