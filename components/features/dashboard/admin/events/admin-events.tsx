"use client";

import { useState, useMemo } from "react";
import { Search, TrendingUp, BarChart3, CalendarDays, Users } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { PageHeader } from "../../shared/page-header";
import { StatCard } from "../../shared/stat-card";
import { AdminEventRow } from "./admin-event-row";

type Filter = "all" | "live" | "closed" | "draft";

const FILTERS: { id: Filter; label: string }[] = [
  { id: "all",    label: "All"    },
  { id: "live",   label: "Live"   },
  { id: "closed", label: "Closed" },
  { id: "draft",  label: "Draft"  },
];

interface Props { base: string }

export function AdminEvents({ base }: Props) {
  const events  = useQuery(api.admin.listAllEvents);
  const [filter, setFilter] = useState<Filter>("all");
  const [query,  setQuery]  = useState("");

  const counts = useMemo(() => ({
    all:    events?.length ?? 0,
    live:   events?.filter((e) => e.status === "live").length ?? 0,
    closed: events?.filter((e) => e.status === "closed").length ?? 0,
    draft:  events?.filter((e) => e.status === "draft").length ?? 0,
  }), [events]);

  const totals = useMemo(() => ({
    revenue: events?.reduce((s, e) => s + e.totalRevenuePesewas, 0) ?? 0,
    votes:   events?.reduce((s, e) => s + e.totalVotes, 0) ?? 0,
  }), [events]);

  const filtered = useMemo(() => {
    if (!events) return [];
    return events.filter((e) =>
      (filter === "all" || e.status === filter) &&
      (!query ||
        e.title.toLowerCase().includes(query.toLowerCase()) ||
        e.organizerName.toLowerCase().includes(query.toLowerCase())),
    );
  }, [events, filter, query]);

  if (events === undefined) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-48 bg-muted rounded" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-28 bg-muted rounded-xl" />)}
        </div>
        <div className="h-64 bg-muted rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Events"
        description="All events created on the platform across every organizer."
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="Total Events"  value={counts.all}                                        sub={`${counts.live} live`}             icon={CalendarDays} />
        <StatCard label="Total Revenue" value={`GHS ${(totals.revenue / 100).toLocaleString()}`}  sub="Gross"                             icon={TrendingUp}   variant="success" />
        <StatCard label="Total Votes"   value={totals.votes.toLocaleString()}                     sub="All events"                        icon={BarChart3}    variant="info" />
        <StatCard label="Organizers"    value={new Set(events.map((e) => e.organizerId)).size}     sub="across all events"                 icon={Users}        variant="warning" />
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex gap-1 p-1 bg-muted rounded-lg shrink-0">
          {FILTERS.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              onClick={() => setFilter(id)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors whitespace-nowrap",
                filter === id
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {label}
              <span className="text-[11px] tabular-nums font-normal text-muted-foreground/70">
                {counts[id]}
              </span>
            </button>
          ))}
        </div>

        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Search events or organizers…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-8 h-9 text-sm w-full"
          />
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          {filtered.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-sm font-medium">No events found</p>
              <p className="text-xs text-muted-foreground mt-1">Try adjusting your filter or search.</p>
            </div>
          ) : (
            <div className="divide-y">
              {filtered.map((event) => (
                <AdminEventRow key={event._id} event={event} base={base} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
