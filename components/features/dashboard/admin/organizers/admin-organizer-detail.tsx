import Link from "next/link";
import {
  Mail,
  Phone,
  CalendarDays,
  TrendingUp,
  BarChart3,
  ChevronRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { PageHeader } from "../../shared/page-header";
import { StatusBadge } from "../../shared/status-badge";
import { getOrganizerById, getEventsByOrg, getOrgStats } from "../data/admin-data";

interface Props {
  base:  string;
  orgId: string;
}

export function AdminOrganizerDetail({ base, orgId }: Props) {
  const org = getOrganizerById(orgId);

  if (!org) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-2 text-center">
        <p className="font-semibold text-lg">Organizer not found</p>
        <Link href={`${base}/organizers`} className="text-sm text-primary hover:underline">
          Back to organizers
        </Link>
      </div>
    );
  }

  const events   = getEventsByOrg(orgId);
  const stats    = getOrgStats(orgId);
  const isActive = org.status === "active";
  const initials = org.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

  return (
    <div className="space-y-6">
      <PageHeader title="Organizer Profile" />

      <Card>
        <CardContent className="pt-6 pb-5">
          <div className="flex items-start gap-4">
            <div className={cn(
              "flex size-14 shrink-0 items-center justify-center rounded-full text-xl font-bold select-none",
              isActive ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground",
            )}>
              {initials}
            </div>
            <div className="flex-1 min-w-0 space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-base font-bold">{org.name}</h2>
                <Badge
                  variant={isActive ? "outline" : "secondary"}
                  className={cn(
                    "text-[10px] h-4 px-1.5",
                    isActive && "text-emerald-700 border-emerald-500/30 bg-emerald-500/10",
                  )}
                >
                  {org.status}
                </Badge>
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><Mail className="size-3" />{org.email}</span>
                <span className="flex items-center gap-1"><Phone className="size-3" />{org.phone}</span>
                <span className="flex items-center gap-1">
                  <CalendarDays className="size-3" />
                  Joined {new Date(org.joinedAt).toLocaleDateString("en-GH", { month: "long", year: "numeric" })}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t grid grid-cols-3 gap-4">
            {[
              { label: "Events",  value: stats.events,                           icon: CalendarDays },
              { label: "Revenue", value: `GHS ${stats.revenue.toLocaleString()}`, icon: TrendingUp  },
              { label: "Votes",   value: stats.votes.toLocaleString(),            icon: BarChart3   },
            ].map(({ label, value, icon: Icon }) => (
              <div key={label} className="text-center space-y-0.5">
                <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
                  <Icon className="size-3.5" />
                  <span className="text-xs">{label}</span>
                </div>
                <p className="text-lg font-bold tabular-nums">{value}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-semibold">Events by {org.name}</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {events.length === 0 ? (
            <div className="py-10 text-center">
              <p className="text-sm text-muted-foreground">No events created yet.</p>
            </div>
          ) : (
            <div className="divide-y">
              {events.map((event) => (
                <Link
                  key={event.id}
                  href={`${base}/events/${event.id}`}
                  className="flex items-center gap-4 px-5 py-4 hover:bg-muted/40 transition-colors"
                >
                  <div className="flex-1 min-w-0 space-y-0.5">
                    <p className="text-sm font-semibold truncate">{event.title}</p>
                    <div className="flex flex-wrap gap-x-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <CalendarDays className="size-3" />{event.date}
                      </span>
                      {event.votes > 0 && (
                        <span className="flex items-center gap-1">
                          <BarChart3 className="size-3" />{event.votes.toLocaleString()} votes
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="hidden sm:block text-sm font-semibold tabular-nums">
                      {event.revenue > 0 ? `GHS ${event.revenue.toLocaleString()}` : "—"}
                    </span>
                    <StatusBadge status={event.status} />
                    <ChevronRight className="size-4 text-muted-foreground" />
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
