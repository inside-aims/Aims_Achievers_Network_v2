import Link from "next/link";
import { ArrowLeft, Tag, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "../../shared/status-badge";
import { PageHeader } from "../../shared/page-header";
import { MOCK_EVENT_DETAILS } from "../data/events";

interface Props {
  base: string;
  eventId: string;
}

export function EventDetail({ base, eventId }: Props) {
  const event = MOCK_EVENT_DETAILS[eventId];

  if (!event) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-2 text-center">
        <p className="font-semibold text-lg">Event not found</p>
        <Link href={`${base}/events`} className="text-sm text-primary hover:underline">
          Back to events
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back + header */}
      <div className="space-y-1">
        <Link
          href={`${base}/events`}
          className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="size-3.5" />
          Back to events
        </Link>
        <div className="flex items-start justify-between gap-4 pt-1">
          <PageHeader title={event.title} description={`${event.location} · ${event.date}`} />
          <StatusBadge status={event.status} />
        </div>
      </div>

      {/* Categories */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Categories</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {event.categories.length === 0 ? (
            <div className="py-12 text-center text-sm text-muted-foreground">
              No categories added yet.
            </div>
          ) : (
            <div className="divide-y">
              {event.categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`${base}/events/${eventId}/categories/${cat.id}`}
                  className="flex items-center justify-between px-6 py-4 clickable"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex size-8 items-center justify-center rounded-md bg-muted shrink-0">
                      <Tag className="size-4 text-muted-foreground" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{cat.name}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{cat.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0 ml-4 text-muted-foreground text-xs">
                    <Users className="size-3.5" />
                    <span>{cat.nomineeCount} nominees</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
