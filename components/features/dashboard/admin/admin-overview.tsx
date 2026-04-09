import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "../shared/stat-card";
import { EventRow } from "../shared/event-row";
import { PageHeader } from "../shared/page-header";
import { ADMIN_STATS, ADMIN_RECENT_EVENTS } from "./data/overview";

interface Props {
  base: string;
}

export function AdminOverview({ base }: Props) {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Platform Overview"
        description="Monitor all events, organizers, and revenue across the platform."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {ADMIN_STATS.map((s) => (
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
        <CardHeader>
          <CardTitle className="text-base">Recent Events</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y">
            {ADMIN_RECENT_EVENTS.map((e) => (
              <EventRow
                key={e.id}
                title={e.title}
                sub={e.organizer}
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
