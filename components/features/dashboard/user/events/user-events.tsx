import { Card, CardContent } from "@/components/ui/card";
import { EventRow } from "../../shared/event-row";
import { PageHeader } from "../../shared/page-header";
import { USER_EVENTS } from "../overview/overview";

interface Props {
  base: string;
}

export function UserEvents({ base }: Props) {
  return (
    <div className="space-y-6">
      <PageHeader
        title="My Events"
        description="Click an event to manage its categories and nominees."
      />

      <Card>
        <CardContent className="p-0">
          {USER_EVENTS.length === 0 ? (
            <div className="py-16 text-center">
              <p className="font-medium">No events yet</p>
              <p className="text-sm text-muted-foreground mt-1">
                Use <strong>New Event</strong> in the sidebar to get started.
              </p>
            </div>
          ) : (
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
          )}
        </CardContent>
      </Card>
    </div>
  );
}
