import Link from "next/link";
import { ChevronRight, Users, CalendarDays } from "lucide-react";
import { StatusBadge } from "../../shared/status-badge";
import { getOrganizerById, type AdminEvent } from "../data/admin-data";

interface Props {
  event: AdminEvent;
  base:  string;
}

export function AdminEventRow({ event, base }: Props) {
  const org = getOrganizerById(event.orgId);

  return (
    <Link
      href={`${base}/events/${event.id}`}
      className="flex items-center gap-4 px-5 py-4 hover:bg-muted/40 transition-colors"
    >
      <div className="flex-1 min-w-0 space-y-0.5">
        <p className="text-sm font-semibold truncate">{event.title}</p>
        <div className="flex flex-wrap items-center gap-x-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Users className="size-3" />
            {org?.name ?? "Unknown"}
          </span>
          <span className="flex items-center gap-1">
            <CalendarDays className="size-3" />
            {event.date}
          </span>
        </div>
      </div>

      <div className="hidden sm:flex flex-col items-end gap-0.5 shrink-0 text-right">
        <span className="text-sm font-semibold tabular-nums">
          {event.revenue > 0 ? `GHS ${event.revenue.toLocaleString()}` : "—"}
        </span>
        <span className="text-xs text-muted-foreground tabular-nums">
          {event.votes > 0 ? `${event.votes.toLocaleString()} votes` : "No votes yet"}
        </span>
      </div>

      <StatusBadge status={event.status} />
      <ChevronRight className="size-4 text-muted-foreground shrink-0" />
    </Link>
  );
}
