import Link from "next/link";
import { ChevronRight, Users, CalendarDays } from "lucide-react";
import { StatusBadge } from "../../shared/status-badge";
import type { Id } from "@/convex/_generated/dataModel";

interface ConvexEvent {
  _id: Id<"events">;
  title: string;
  status: string;
  eventDate?: number;
  organizerName: string;
  totalVotes: number;
  totalRevenuePesewas: number;
}

interface Props {
  event: ConvexEvent;
  base:  string;
}

export function AdminEventRow({ event, base }: Props) {
  const dateStr = event.eventDate
    ? new Date(event.eventDate).toLocaleDateString("en-GH", { day: "numeric", month: "short", year: "numeric" })
    : "";

  return (
    <Link
      href={`${base}/events/${event._id}`}
      className="flex items-center gap-4 px-5 py-4 hover:bg-muted/40 transition-colors"
    >
      <div className="flex-1 min-w-0 space-y-0.5">
        <p className="text-sm font-semibold truncate">{event.title}</p>
        <div className="flex flex-wrap items-center gap-x-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Users className="size-3" />
            {event.organizerName}
          </span>
          {dateStr && (
            <span className="flex items-center gap-1">
              <CalendarDays className="size-3" />
              {dateStr}
            </span>
          )}
        </div>
      </div>

      <div className="hidden sm:flex flex-col items-end gap-0.5 shrink-0 text-right">
        <span className="text-sm font-semibold tabular-nums">
          {event.totalRevenuePesewas > 0 ? `GHS ${(event.totalRevenuePesewas / 100).toLocaleString()}` : "—"}
        </span>
        <span className="text-xs text-muted-foreground tabular-nums">
          {event.totalVotes > 0 ? `${event.totalVotes.toLocaleString()} votes` : "No votes yet"}
        </span>
      </div>

      <StatusBadge status={event.status} />
      <ChevronRight className="size-4 text-muted-foreground shrink-0" />
    </Link>
  );
}
