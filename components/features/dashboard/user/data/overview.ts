import { CalendarDays, TrendingUp, BarChart3, Banknote } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface StatConfig {
  label: string;
  value: string;
  sub: string;
  icon: LucideIcon;
  routeKey: string;
}

export interface MyEvent {
  id: string;
  title: string;
  location: string;
  status: string;
}

export const USER_STATS: StatConfig[] = [
  { label: "My Events",   value: "4",         sub: "All time",          icon: CalendarDays, routeKey: "events"    },
  { label: "Live Events", value: "2",         sub: "Currently active",  icon: TrendingUp,   routeKey: "events"    },
  { label: "Total Votes", value: "12,480",    sub: "Across all events", icon: BarChart3,    routeKey: "analytics" },
  { label: "Revenue",     value: "GHS 4,320", sub: "Your earnings",     icon: Banknote,     routeKey: "analytics" },
];

export const USER_EVENTS: MyEvent[] = [
  { id: "evt-1", title: "FAST Excellence Awards 2025", location: "Koforidua, Ghana", status: "live"   },
  { id: "evt-2", title: "FOE Engineering Awards 2025", location: "Koforidua, Ghana", status: "closed" },
  { id: "evt-3", title: "FBMS Business Awards 2025",   location: "Koforidua, Ghana", status: "live"   },
  { id: "evt-4", title: "FBNE Innovation Awards 2025", location: "Koforidua, Ghana", status: "draft"  },
];
