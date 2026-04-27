"use client";

import Link from "next/link";
import {
  Mail,
  Phone,
  CalendarDays,
  TrendingUp,
  BarChart3,
  ChevronRight,
} from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { PageHeader } from "../../shared/page-header";
import { StatusBadge } from "../../shared/status-badge";

interface Props {
  base:  string;
  orgId: string;
}

function DetailSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-8 w-48 bg-muted rounded" />
      <div className="h-40 bg-muted rounded-xl" />
      <div className="h-64 bg-muted rounded-xl" />
    </div>
  );
}

export function AdminOrganizerDetail({ base, orgId }: Props) {
  const organizerId = orgId as Id<"organizerProfiles">;
  const data = useQuery(api.admin.getOrganizerDetail, { organizerId });

  if (data === undefined) return <DetailSkeleton />;

  if (data === null) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-2 text-center">
        <p className="font-semibold text-lg">Organizer not found</p>
        <Link href={`${base}/organizers`} className="text-sm text-primary hover:underline">
          Back to organizers
        </Link>
      </div>
    );
  }

  const { organizer: org, events, stats } = data;
  const isActive = org.status === "active" || org.status === undefined;
  const initials = org.displayName.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
  const joinedAt = new Date(org.createdAt).toLocaleDateString("en-GH", { month: "long", year: "numeric" });

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
                <h2 className="text-base font-bold">{org.displayName}</h2>
                <Badge
                  variant={isActive ? "outline" : "secondary"}
                  className={cn(
                    "text-[10px] h-4 px-1.5",
                    isActive && "text-emerald-700 border-emerald-500/30 bg-emerald-500/10",
                  )}
                >
                  {org.status ?? "active"}
                </Badge>
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-muted-foreground">
                {org.email && (
                  <span className="flex items-center gap-1"><Mail className="size-3" />{org.email}</span>
                )}
                {org.phone && (
                  <span className="flex items-center gap-1"><Phone className="size-3" />{org.phone}</span>
                )}
                <span className="flex items-center gap-1">
                  <CalendarDays className="size-3" />
                  Joined {joinedAt}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t grid grid-cols-3 gap-4">
            {[
              { label: "Events",  value: stats.totalEvents,                                           icon: CalendarDays },
              { label: "Revenue", value: `GHS ${(stats.totalRevenuePesewas / 100).toLocaleString()}`, icon: TrendingUp  },
              { label: "Votes",   value: stats.totalVotes.toLocaleString(),                           icon: BarChart3   },
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
          <CardTitle className="text-sm font-semibold">Events by {org.displayName}</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {events.length === 0 ? (
            <div className="py-10 text-center">
              <p className="text-sm text-muted-foreground">No events created yet.</p>
            </div>
          ) : (
            <div className="divide-y">
              {events.map((event) => {
                const eventDate = event.eventDate
                  ? new Date(event.eventDate).toLocaleDateString("en-GH", { day: "numeric", month: "short", year: "numeric" })
                  : "";
                return (
                  <Link
                    key={event._id}
                    href={`${base}/events/${event._id}`}
                    className="flex items-center gap-4 px-5 py-4 hover:bg-muted/40 transition-colors"
                  >
                    <div className="flex-1 min-w-0 space-y-0.5">
                      <p className="text-sm font-semibold truncate">{event.title}</p>
                      <div className="flex flex-wrap gap-x-3 text-xs text-muted-foreground">
                        {eventDate && (
                          <span className="flex items-center gap-1">
                            <CalendarDays className="size-3" />{eventDate}
                          </span>
                        )}
                        {event.totalVotes > 0 && (
                          <span className="flex items-center gap-1">
                            <BarChart3 className="size-3" />{event.totalVotes.toLocaleString()} votes
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="hidden sm:block text-sm font-semibold tabular-nums">
                        {event.grossRevenuePesewas > 0 ? `GHS ${(event.grossRevenuePesewas / 100).toLocaleString()}` : "—"}
                      </span>
                      <StatusBadge status={event.status} />
                      <ChevronRight className="size-4 text-muted-foreground" />
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
