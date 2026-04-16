"use client"

import { useState } from "react"
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Trophy,
  Wallet,
  Vote,
  Users,
  CalendarDays,
  Building2,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { PageHeader } from "@/components/features/dashboard/shared/page-header"
import { StatusBadge } from "@/components/features/dashboard/shared/status-badge"
import {
  MOCK_EVENT_DETAILS,
  computeStats,
  formatCurrency,
} from "../events/events"
import { formatDate } from "@/lib/date-utils"
import { cn } from "@/lib/utils"

// ── Derived data ──────────────────────────────────────────────────────────────

const ALL_EVENTS = Object.values(MOCK_EVENT_DETAILS)

interface EventRow {
  id:              string
  title:           string
  institution:     string
  status:          string
  date:            string
  totalVotes:      number
  revenueRaw:      number
  revenue:         string
  totalCategories: number
  totalNominees:   number
  currency:        string
}

interface NomineeRow {
  id:           string
  name:         string
  votes:        number
  eventTitle:   string
  categoryName: string
}

const EVENT_ROWS: EventRow[] = ALL_EVENTS.map((event) => {
  const s = computeStats(event)
  return {
    id:              event.id,
    title:           event.title,
    institution:     event.institution,
    status:          event.status,
    date:            event.date,
    totalVotes:      s.totalVotes,
    revenueRaw:      s.revenueRaw,
    revenue:         s.revenue,
    totalCategories: s.totalCategories,
    totalNominees:   s.totalNominees,
    currency:        event.currency,
  }
})

const TOTAL_VOTES   = EVENT_ROWS.reduce((sum, e) => sum + e.totalVotes, 0)
const TOTAL_REVENUE = EVENT_ROWS.reduce((sum, e) => sum + e.revenueRaw, 0)
const LIVE_EVENTS   = ALL_EVENTS.filter((e) => e.status === "live").length
const TOTAL_NOMINEES = EVENT_ROWS.reduce((sum, e) => sum + e.totalNominees, 0)
const PRIMARY_CURRENCY = ALL_EVENTS[0]?.currency ?? "GHS"

const ALL_NOMINEES: NomineeRow[] = ALL_EVENTS.flatMap((event) =>
  event.categories.flatMap((cat) =>
    cat.nominees.map((n) => ({
      id:           n.id,
      name:         n.name,
      votes:        n.votes,
      eventTitle:   event.title,
      categoryName: cat.name,
    })),
  ),
).sort((a, b) => b.votes - a.votes)

const MAX_EVENT_VOTES   = Math.max(...EVENT_ROWS.map((e) => e.totalVotes), 1)
const MAX_EVENT_REVENUE = Math.max(...EVENT_ROWS.map((e) => e.revenueRaw), 1)
const MAX_NOMINEE_VOTES = ALL_NOMINEES[0]?.votes ?? 1

// ── KPI card ──────────────────────────────────────────────────────────────────

interface KpiProps {
  label:  string
  value:  string | number
  icon:   LucideIcon
  trend?: "up" | "down" | "flat"
  sub?:   string
  color?: string
}

function KpiCard({ label, value, icon: Icon, trend, sub, color = "text-primary" }: KpiProps) {
  const TrendIcon =
    trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : trend === "flat" ? Minus : null
  const trendColor =
    trend === "up"   ? "text-emerald-600 dark:text-emerald-400" :
    trend === "down" ? "text-red-500 dark:text-red-400"         :
    "text-muted-foreground"

  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1 min-w-0">
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="text-2xl font-bold tabular-nums leading-tight">
              {typeof value === "number" ? value.toLocaleString() : value}
            </p>
            {(TrendIcon || sub) && (
              <div className={cn("flex items-center gap-1 text-xs font-medium", trendColor)}>
                {TrendIcon && <TrendIcon className="size-3.5" />}
                {sub && <span>{sub}</span>}
              </div>
            )}
          </div>
          <div className={cn("shrink-0 size-9 rounded-lg flex items-center justify-center bg-primary/10", color)}>
            <Icon className="size-4" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ── Bar util ──────────────────────────────────────────────────────────────────

function Bar({ pct, className }: { pct: number; className?: string }) {
  return (
    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
      <div
        className={cn("h-full rounded-full transition-all duration-700", className ?? "bg-primary")}
        style={{ width: `${Math.max(pct, 2)}%` }}
      />
    </div>
  )
}

// ── Event performance ─────────────────────────────────────────────────────────

type PerfMode = "votes" | "revenue"

function EventPerformance() {
  const [mode, setMode] = useState<PerfMode>("votes")

  const sorted = [...EVENT_ROWS].sort((a, b) =>
    mode === "votes" ? b.totalVotes - a.totalVotes : b.revenueRaw - a.revenueRaw,
  )

  return (
    <Card className="flex flex-col">
      <CardHeader className="pb-3 flex-row items-center justify-between gap-3 flex-wrap">
        <CardTitle className="text-sm font-bold">Event Performance</CardTitle>
        <Select value={mode} onValueChange={(v) => setMode(v as PerfMode)}>
          <SelectTrigger className="w-32 h-8 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="votes">By Votes</SelectItem>
            <SelectItem value="revenue">By Revenue</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>

      <CardContent className="flex-1 space-y-4">
        {sorted.map((event, i) => {
          const pct =
            mode === "votes"
              ? (event.totalVotes / MAX_EVENT_VOTES) * 100
              : (event.revenueRaw / MAX_EVENT_REVENUE) * 100
          const label =
            mode === "votes"
              ? event.totalVotes.toLocaleString()
              : event.revenue

          const barColors = [
            "bg-chart-1", "bg-chart-2", "bg-chart-4", "bg-chart-5",
          ]

          return (
            <div key={event.id} className="space-y-1.5">
              <div className="flex items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-muted-foreground shrink-0 w-4 text-right">{i + 1}.</span>
                  <div className="min-w-0">
                    <p className="font-medium truncate">{event.title}</p>
                    <div className="flex items-center gap-1.5 text-muted-foreground mt-0.5">
                      <StatusBadge status={event.status} />
                    </div>
                  </div>
                </div>
                <span className="font-semibold tabular-nums shrink-0">{label}</span>
              </div>
              <Bar pct={pct} className={barColors[i % barColors.length]} />
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}

// ── Top nominees ──────────────────────────────────────────────────────────────

const RANK_COLORS = [
  "bg-amber-400 text-white",
  "bg-slate-400 text-white",
  "bg-amber-700 text-white",
]

function TopNominees() {
  const top = ALL_NOMINEES.slice(0, 8)

  return (
    <Card className="flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-bold">Top Nominees by Votes</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 space-y-3">
        {top.map((n, i) => {
          const pct = (n.votes / MAX_NOMINEE_VOTES) * 100
          return (
            <div key={n.id} className="space-y-1">
              <div className="flex items-center gap-2 text-xs">
                <span
                  className={cn(
                    "size-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0",
                    i < 3 ? RANK_COLORS[i] : "bg-muted text-muted-foreground",
                  )}
                >
                  {i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-medium truncate">{n.name}</p>
                  <p className="text-muted-foreground truncate">{n.categoryName}</p>
                </div>
                <span className="font-semibold tabular-nums shrink-0">{n.votes.toLocaleString()}</span>
              </div>
              <Bar pct={pct} className={i === 0 ? "bg-amber-400" : "bg-primary/60"} />
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}

// ── Category breakdown ────────────────────────────────────────────────────────

function CategoryBreakdown() {
  const eventsWithCategories = ALL_EVENTS.filter((e) => e.categories.length > 0)
  const [selectedId, setSelectedId] = useState(eventsWithCategories[0]?.id ?? "")

  const event = MOCK_EVENT_DETAILS[selectedId]
  const categories = event?.categories ?? []

  return (
    <Card>
      <CardHeader className="pb-3 flex-row items-center justify-between gap-3 flex-wrap">
        <CardTitle className="text-sm font-bold">Category Breakdown</CardTitle>
        <Select value={selectedId} onValueChange={setSelectedId}>
          <SelectTrigger className="w-52 h-8 text-xs">
            <SelectValue placeholder="Select an event" />
          </SelectTrigger>
          <SelectContent>
            {eventsWithCategories.map((e) => (
              <SelectItem key={e.id} value={e.id}>{e.title}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>

      <CardContent>
        {categories.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            No categories for this event yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {categories.map((cat) => {
              const catTotal = cat.nominees.reduce((sum, n) => sum + n.votes, 0) || 1
              const sorted = [...cat.nominees].sort((a, b) => b.votes - a.votes)
              return (
                <div key={cat.id} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold">{cat.name}</p>
                    <span className="text-xs text-muted-foreground">
                      {catTotal.toLocaleString()} votes
                    </span>
                  </div>
                  <div className="space-y-2">
                    {sorted.map((nominee, i) => {
                      const pct = (nominee.votes / catTotal) * 100
                      return (
                        <div key={nominee.id} className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-1.5 min-w-0">
                              {i === 0 && <Trophy className="size-3 text-amber-500 shrink-0" />}
                              <span className={cn("truncate", i === 0 ? "font-semibold" : "")}>
                                {nominee.name}
                              </span>
                            </div>
                            <span className="text-muted-foreground shrink-0 ml-2">
                              {nominee.votes.toLocaleString()} ({Math.round(pct)}%)
                            </span>
                          </div>
                          <Bar
                            pct={pct}
                            className={i === 0 ? "bg-primary" : "bg-primary/40"}
                          />
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// ── Event summary table ───────────────────────────────────────────────────────

function EventSummaryTable() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-bold">All Events</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b">
                <th className="text-left text-muted-foreground font-medium px-5 py-2.5">Event</th>
                <th className="text-right text-muted-foreground font-medium px-4 py-2.5 hidden sm:table-cell">Date</th>
                <th className="text-right text-muted-foreground font-medium px-4 py-2.5">Votes</th>
                <th className="text-right text-muted-foreground font-medium px-4 py-2.5 hidden md:table-cell">Nominees</th>
                <th className="text-right text-muted-foreground font-medium px-5 py-2.5">Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {EVENT_ROWS.map((event) => (
                <tr key={event.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-5 py-3">
                    <div>
                      <p className="font-medium leading-snug">{event.title}</p>
                      <div className="flex items-center gap-1.5 mt-1">
                        <Building2 className="size-3 text-muted-foreground shrink-0" />
                        <span className="text-muted-foreground truncate max-w-[180px]">
                          {event.institution}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right text-muted-foreground hidden sm:table-cell whitespace-nowrap">
                    {formatDate(event.date)}
                  </td>
                  <td className="px-4 py-3 text-right font-semibold tabular-nums">
                    {event.totalVotes.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-right text-muted-foreground hidden md:table-cell">
                    {event.totalNominees}
                  </td>
                  <td className="px-5 py-3 text-right font-semibold tabular-nums">
                    {event.revenue}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t bg-muted/20">
                <td className="px-5 py-3 font-bold text-sm" colSpan={2}>Total</td>
                <td className="px-4 py-3 text-right font-bold tabular-nums hidden sm:table-cell">
                  {TOTAL_VOTES.toLocaleString()}
                </td>
                <td className="px-4 py-3 text-right font-bold tabular-nums hidden md:table-cell" />
                <td className="px-5 py-3 text-right font-bold tabular-nums">
                  {formatCurrency(TOTAL_REVENUE, PRIMARY_CURRENCY)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

export function UserAnalytics() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Analytics"
        description="Performance overview across all your events."
      />

      {/* KPI cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KpiCard
          label="Total Revenue"
          value={formatCurrency(TOTAL_REVENUE, PRIMARY_CURRENCY)}
          icon={Wallet}
          trend="up"
          sub="across all events"
        />
        <KpiCard
          label="Total Votes"
          value={TOTAL_VOTES}
          icon={Vote}
          trend="up"
          sub="cumulative"
        />
        <KpiCard
          label="Live Events"
          value={LIVE_EVENTS}
          icon={CalendarDays}
          trend={LIVE_EVENTS > 0 ? "up" : "flat"}
          sub={`of ${ALL_EVENTS.length} total`}
        />
        <KpiCard
          label="Total Nominees"
          value={TOTAL_NOMINEES}
          icon={Users}
          trend="flat"
          sub="across all events"
        />
      </div>

      {/* Event performance + top nominees */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <EventPerformance />
        <TopNominees />
      </div>

      {/* Category breakdown */}
      <CategoryBreakdown />

      {/* Summary table */}
      <EventSummaryTable />
    </div>
  )
}
