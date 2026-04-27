"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { CalendarDays, Users, BarChart3, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "../../shared/stat-card";
import { EventRow } from "../../shared/event-row";
import { PageHeader } from "../../shared/page-header";

interface Props {
  base: string;
}

function OverviewSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="h-8 w-48 bg-muted rounded" />
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-28 bg-muted rounded-xl" />
        ))}
      </div>
      <div className="h-64 bg-muted rounded-xl" />
    </div>
  );
}

export function AdminOverview({ base }: Props) {
  const data = useQuery(api.admin.platformOverview);

  if (data === undefined) return <OverviewSkeleton />;

  const stats = [
    {
      label: "Total Events",
      value: data.events.total,
      sub: `${data.events.live} live right now`,
      icon: CalendarDays,
      href: `${base}/events`,
    },
    {
      label: "Organizers",
      value: data.organizers.total,
      sub: `${data.organizers.active} active`,
      icon: Users,
      href: `${base}/organizers`,
    },
    {
      label: "Votes Cast",
      value: data.totalVotes.toLocaleString(),
      sub: "Across all events",
      icon: BarChart3,
      href: `${base}/analytics`,
    },
    {
      label: "Platform Revenue",
      value: `GHS ${(data.platformCutPesewas / 100).toLocaleString()}`,
      sub: `of GHS ${(data.totalRevenuePesewas / 100).toLocaleString()} gross`,
      icon: TrendingUp,
      href: `${base}/analytics`,
    },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        title="Platform Overview"
        description="Monitor all events, organizers, and revenue across the platform."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((s) => (
          <StatCard
            key={s.label}
            label={s.label}
            value={s.value}
            sub={s.sub}
            icon={s.icon}
            href={s.href}
          />
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recent Events</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y">
            {data.recentEvents.map((e) => (
              <EventRow
                key={e._id}
                title={e.title}
                sub={e.organizerName}
                status={e.status}
                href={`${base}/events/${e._id}`}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
