import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "../shared/stat-card";
import { EventRow } from "../shared/event-row";
import { PageHeader } from "../shared/page-header";
import { USER_STATS, USER_EVENTS } from "./data/overview";

interface Props {
  base: string;
}

export function UserOverview({ base }: Props) {
  return (
    <div className="space-y-8">
      <PageHeader
        title="My Dashboard"
        description="Manage your events, track votes, and monitor revenue."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {USER_STATS.map((s) => (
          <StatCard
            key={s.label}
            label={s.label}
            value={s.value}
            sub={s.sub}
            icon={s.icon}
            href={`${base}/${s.routeKey}`}
          />
        ))}
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">My Events</CardTitle>
          <Link
            href={`${base}/events`}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            View all
          </Link>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y">
            {USER_EVENTS.map((e) => (
              <EventRow
                key={e.id}
                title={e.title}
                sub={e.location}
                status={e.status}
                href={`${base}/events/${e.id}`}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
