"use client";

import { useState, useMemo } from "react";
import { Search, TrendingUp, BarChart3, CalendarDays, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { PageHeader } from "../../shared/page-header";
import { StatCard } from "../../shared/stat-card";
import { AdminEventRow } from "./admin-event-row";
import { ADMIN_EVENTS, getOrganizerById, getPlatformSummary } from "../data/admin-data";

type Filter = "all" | "live" | "closed" | "draft";

const FILTERS: { id: Filter; label: string }[] = [
  { id: "all",    label: "All"    },
  { id: "live",   label: "Live"   },
  { id: "closed", label: "Closed" },
  { id: "draft",  label: "Draft"  },
];

interface Props { base: string }

export function AdminEvents({ base }: Props) {
  const [filter, setFilter] = useState<Filter>("all");
  const [query,  setQuery]  = useState("");

  const s = getPlatformSummary();

  const counts = useMemo(() => ({
    all:    ADMIN_EVENTS.length,
    live:   ADMIN_EVENTS.filter((e) => e.status === "live").length,
    closed: ADMIN_EVENTS.filter((e) => e.status === "closed").length,
    draft:  ADMIN_EVENTS.filter((e) => e.status === "draft").length,
  }), []);

  const filtered = useMemo(() =>
    ADMIN_EVENTS.filter((e) => {
      const org = getOrganizerById(e.orgId);
      return (
        (filter === "all" || e.status === filter) &&
        (!query ||
          e.title.toLowerCase().includes(query.toLowerCase()) ||
          org?.name.toLowerCase().includes(query.toLowerCase()))
      );
    }),
  [filter, query]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Events"
        description="All events created on the platform across every organizer."
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="Total Events"  value={s.totalEvents}                       sub={`${s.liveEvents} live`}      icon={CalendarDays} />
        <StatCard label="Total Revenue" value={`GHS ${s.totalRevenue.toLocaleString()}`} sub="Gross"                 icon={TrendingUp}   variant="success" />
        <StatCard label="Total Votes"   value={s.totalVotes.toLocaleString()}        sub="All events"                 icon={BarChart3}    variant="info" />
        <StatCard label="Organizers"    value={s.totalOrganizers}                    sub={`${s.activeOrgs} active`}   icon={Users}        variant="warning" />
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
                <AdminEventRow key={event.id} event={event} base={base} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
