import Link from "next/link";
import { CalendarDays, TrendingUp, BarChart3, Banknote } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "../../shared/stat-card";
import { EventRow } from "../../shared/event-row";
import { PageHeader } from "../../shared/page-header";
import { computeOverviewStats, getMyEvents } from "./overview";
import type { StatVariant } from "../../shared/stat-card";

interface StatConfig {
  label: string;
  value: string | number;
  sub: string;
  icon: typeof CalendarDays;
  variant: StatVariant;
  routeKey: string;
}

interface Props {
  base: string;
}

export function UserOverview({ base }: Props) {
  const stats  = computeOverviewStats();
  const events = getMyEvents();

  const STATUS_SUMMARY = [
    stats.liveEvents   > 0 && `${stats.liveEvents} live`,
    stats.draftEvents  > 0 && `${stats.draftEvents} draft`,
    stats.closedEvents > 0 && `${stats.closedEvents} closed`,
  ].filter(Boolean).join(" · ");

  const STAT_CARDS: StatConfig[] = [
    {
      label:    "My Events",
      value:    stats.totalEvents,
      sub:      STATUS_SUMMARY || "No events yet",
      icon:     CalendarDays,
      variant:  "default",
      routeKey: "events",
    },
    {
      label:    "Live Events",
      value:    stats.liveEvents,
      sub:      stats.liveEvents > 0 ? "Currently accepting votes" : "No active events",
      icon:     TrendingUp,
      variant:  "success",
      routeKey: "events",
    },
    {
      label:    "Total Votes",
      value:    stats.totalVotes,
      sub:      `Across ${stats.totalEvents} event${stats.totalEvents !== 1 ? "s" : ""}`,
      icon:     BarChart3,
      variant:  "info",
      routeKey: "analytics",
    },
    {
      label:    "Revenue",
      value:    stats.revenue,
      sub:      `From ${stats.totalVotes.toLocaleString()} votes`,
      icon:     Banknote,
      variant:  "warning",
      routeKey: "analytics",
    },
  ];

  return (
    <div className="space-y-6 md:space-y-8">
      <PageHeader
        title="My Dashboard"
        description="Manage your events, track votes, and monitor revenue."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 md:gap-4">
        {STAT_CARDS.map((s) => (
          <StatCard
            key={s.label}
            label={s.label}
            value={s.value}
            sub={s.sub}
            icon={s.icon}
            variant={s.variant}
            href={`${base}/${s.routeKey}`}
          />
        ))}
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between py-4 md:py-5">
          <CardTitle className="text-sm md:text-base">My Events</CardTitle>
          <Link
            href={`${base}/events`}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            View all
          </Link>
        </CardHeader>
        <CardContent className="p-0">
          {events.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-sm font-medium">No events yet</p>
              <p className="text-xs text-muted-foreground mt-1">
                Create your first event to get started.
              </p>
            </div>
          ) : (
            <div className="divide-y">
              {events.map((e) => (
                <EventRow
                  key={e.id}
                  title={e.title}
                  sub={e.location}
                  status={e.status}
                  href={`${base}/events/${e.id}`}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
