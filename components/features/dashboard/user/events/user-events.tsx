"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { EventRow } from "../../shared/event-row";
import { PageHeader } from "../../shared/page-header";

interface Props {
  base: string;
}

function EventsListSkeleton() {
  return (
    <Card>
      <CardContent className="p-0">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center justify-between px-6 py-4 border-b last:border-0">
            <div className="space-y-1.5">
              <Skeleton className="h-4 w-52" />
              <Skeleton className="h-3 w-32" />
            </div>
            <Skeleton className="h-5 w-16 rounded-full" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export function UserEvents({ base }: Props) {
  const events = useQuery(api.events.listByOrganizer);

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Events"
        description="Click an event to manage its categories and nominees."
      />

      {events === undefined ? (
        <EventsListSkeleton />
      ) : (
        <Card>
          <CardContent className="p-0">
            {events.length === 0 ? (
              <div className="py-16 text-center">
                <p className="font-medium">No events yet</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Use <strong>New Event</strong> in the sidebar to get started.
                </p>
              </div>
            ) : (
              <div className="divide-y">
                {events.map((e) => (
                  <EventRow
                    key={e._id}
                    title={e.title}
                    sub={e.location ?? ""}
                    status={e.status}
                    href={`${base}/events/${e._id}`}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
