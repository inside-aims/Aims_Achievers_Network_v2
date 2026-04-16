"use client";

import Link from "next/link";
import { CalendarDays, TrendingUp, BarChart3, Banknote } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "../../shared/stat-card";
import { EventRow } from "../../shared/event-row";
import { PageHeader } from "../../shared/page-header";
import { OverviewSkeleton } from "../../shared/overview-skeleton";
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

function formatRevenue(pesewas: number): string {
  return new Intl.NumberFormat("en-GH", {
    style: "currency",
    currency: "GHS",
    currencyDisplay: "code",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(pesewas / 100);
}

export function UserOverview({ base }: Props) {
  const data = useQuery(api.dashboard.organizerOverview);

  if (data === undefined) return <OverviewSkeleton />;

  const counts  = data?.counts  ?? { total: 0, live: 0, published: 0, draft: 0, closed: 0 };
  const events  = data?.events  ?? [];
  const totalVotes         = data?.totalVotes         ?? 0;
  const totalRevenuePesewas = data?.totalRevenuePesewas ?? 0;

  const STATUS_SUMMARY = [
    counts.live      > 0 && `${counts.live} live`,
    counts.published > 0 && `${counts.published} published`,
    counts.draft     > 0 && `${counts.draft} draft`,
    counts.closed    > 0 && `${counts.closed} closed`,
  ].filter(Boolean).join(" · ");

  const STAT_CARDS: StatConfig[] = [
    {
      label:    "My Events",
      value:    counts.total,
      sub:      STATUS_SUMMARY || "No events yet",
      icon:     CalendarDays,
      variant:  "default",
      routeKey: "events",
    },
    {
      label:    "Live Events",
      value:    counts.live,
      sub:      counts.live > 0 ? "Currently accepting votes" : "No active events",
      icon:     TrendingUp,
      variant:  "success",
      routeKey: "events",
    },
    {
      label:    "Total Votes",
      value:    totalVotes,
      sub:      `Across ${counts.total} event${counts.total !== 1 ? "s" : ""}`,
      icon:     BarChart3,
      variant:  "info",
      routeKey: "analytics",
    },
    {
      label:    "Revenue",
      value:    formatRevenue(totalRevenuePesewas),
      sub:      `From ${totalVotes.toLocaleString()} votes`,
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
                  key={e._id}
                  title={e.title}
                  sub={e.location}
                  status={e.status}
                  href={`${base}/events/${e._id}`}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
