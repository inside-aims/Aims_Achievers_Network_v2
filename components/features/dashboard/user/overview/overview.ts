import { MOCK_EVENT_DETAILS, computeStats, formatCurrency } from "../events/events";

export interface OverviewStats {
  totalEvents: number;
  liveEvents: number;
  draftEvents: number;
  closedEvents: number;
  totalVotes: number;
  revenue: string;
  revenueRaw: number;
}

export interface MyEvent {
  id: string;
  title: string;
  location: string;
  status: string;
}

export function computeOverviewStats(): OverviewStats {
  const events = Object.values(MOCK_EVENT_DETAILS);

  const totalEvents  = events.length;
  const liveEvents   = events.filter((e) => e.status === "live").length;
  const draftEvents  = events.filter((e) => e.status === "draft").length;
  const closedEvents = events.filter((e) => e.status === "closed").length;

  const allStats    = events.map(computeStats);
  const totalVotes  = allStats.reduce((sum, s) => sum + s.totalVotes, 0);
  const revenueRaw  = allStats.reduce((sum, s) => sum + s.revenueRaw, 0);

  const primaryCurrency = events[0]?.currency ?? "GHS";
  const revenue = formatCurrency(revenueRaw, primaryCurrency);

  return { totalEvents, liveEvents, draftEvents, closedEvents, totalVotes, revenue, revenueRaw };
}

export function getMyEvents(): MyEvent[] {
  return Object.values(MOCK_EVENT_DETAILS).map((e) => ({
    id:       e.id,
    title:    e.title,
    location: e.location,
    status:   e.status,
  }));
}
