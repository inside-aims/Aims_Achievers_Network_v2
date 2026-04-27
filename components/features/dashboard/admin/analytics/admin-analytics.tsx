import {
  TrendingUp,
  BarChart3,
  CalendarDays,
  Users,
  Coins,
  Activity,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "../../shared/page-header";
import { StatusBadge } from "../../shared/status-badge";
import {
  ADMIN_EVENTS,
  ADMIN_ORGANIZERS,
  MONTHLY_TREND,
  getPlatformSummary,
  PLATFORM_COMMISSION,
} from "../data/admin-data";

export function AdminAnalytics() {
  const s          = getPlatformSummary();
  const maxRevenue = Math.max(...ADMIN_EVENTS.map((e) => e.revenue), 1);
  const maxVotes   = Math.max(...ADMIN_EVENTS.map((e) => e.votes), 1);
  const maxMonth   = Math.max(...MONTHLY_TREND.map((m) => m.revenue), 1);

  const topOrg = [...ADMIN_ORGANIZERS]
    .map((o) => {
      const orgEvents = ADMIN_EVENTS.filter((e) => e.orgId === o.id);
      return {
        ...o,
        revenue: orgEvents.reduce((sum, e) => sum + e.revenue, 0),
        votes:   orgEvents.reduce((sum, e) => sum + e.votes, 0),
      };
    })
    .sort((a, b) => b.revenue - a.revenue)[0];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Analytics"
        description="Platform-wide performance across all events and organizers."
      />

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {[
          { label: "Gross Revenue",        value: `GHS ${s.totalRevenue.toLocaleString()}`,  icon: TrendingUp,   color: "text-emerald-600" },
          { label: `Platform Cut (${(PLATFORM_COMMISSION * 100).toFixed(0)}%)`, value: `GHS ${s.platformCut.toLocaleString()}`, icon: Coins, color: "text-primary" },
          { label: "Total Votes",          value: s.totalVotes.toLocaleString(),              icon: BarChart3,    color: "text-violet-600"  },
          { label: "Active Events",        value: String(s.liveEvents),                       icon: CalendarDays, color: "text-amber-600"   },
          { label: "Organizers",           value: String(s.totalOrganizers),                  icon: Users,        color: "text-foreground"  },
          { label: "Avg. Revenue / Event", value: `GHS ${s.avgRevenue.toLocaleString()}`,     icon: Activity,     color: "text-foreground"  },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-card border border-border rounded-xl px-4 py-3.5 space-y-1.5">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Icon className="size-3.5 shrink-0" />
              <span className="text-xs font-medium">{label}</span>
            </div>
            <p className={`text-xl font-bold tabular-nums ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">Revenue by Event</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {ADMIN_EVENTS.map((event) => {
              const pct = (event.revenue / maxRevenue) * 100;
              return (
                <div key={event.id} className="space-y-1.5">
                  <div className="flex items-center justify-between gap-3 text-xs">
                    <span className="truncate font-medium">{event.title}</span>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="font-semibold tabular-nums">
                        {event.revenue > 0 ? `GHS ${event.revenue.toLocaleString()}` : "—"}
                      </span>
                      <StatusBadge status={event.status} />
                    </div>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div className="h-full rounded-full bg-primary transition-all duration-500" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">Votes by Event</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {ADMIN_EVENTS.map((event) => {
              const pct = (event.votes / maxVotes) * 100;
              return (
                <div key={event.id} className="space-y-1.5">
                  <div className="flex items-center justify-between gap-3 text-xs">
                    <span className="truncate font-medium">{event.title}</span>
                    <span className="font-semibold tabular-nums shrink-0">
                      {event.votes > 0 ? event.votes.toLocaleString() : "—"}
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div className="h-full rounded-full bg-violet-500 transition-all duration-500" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold">Monthly Revenue Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {MONTHLY_TREND.map((m) => {
              const pct = (m.revenue / maxMonth) * 100;
              return (
                <div key={m.month} className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground w-20 shrink-0">{m.month}</span>
                  <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                    <div className="h-full rounded-full bg-emerald-500 transition-all duration-500" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="text-xs font-semibold tabular-nums w-24 text-right shrink-0">
                    GHS {m.revenue.toLocaleString()}
                  </span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {topOrg && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">Top Performing Organizer</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-base select-none">
                {topOrg.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold">{topOrg.name}</p>
                <p className="text-xs text-muted-foreground">{topOrg.email}</p>
              </div>
              <div className="flex flex-col items-end gap-0.5 shrink-0">
                <span className="text-sm font-bold text-emerald-600">GHS {topOrg.revenue.toLocaleString()}</span>
                <span className="text-xs text-muted-foreground">{topOrg.votes.toLocaleString()} votes</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
