"use client"

import { useState } from "react"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
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
import { Skeleton } from "@/components/ui/skeleton"
import { PageHeader } from "@/components/features/dashboard/shared/page-header"
import { StatusBadge } from "@/components/features/dashboard/shared/status-badge"
import { cn } from "@/lib/utils"

// ── Formatting ─────────────────────────────────────────────────────────────────

function formatCurrency(pesewas: number, currency = "GHS") {
  const major = pesewas / 100
  return new Intl.NumberFormat("en-GH", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(major)
}

function formatDate(ms: number | null) {
  if (!ms) return "—"
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(ms))
}

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

function KpiSkeleton() {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-2 flex-1">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-7 w-32" />
            <Skeleton className="h-3 w-20" />
          </div>
          <Skeleton className="size-9 rounded-lg shrink-0" />
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

// ── Types ──────────────────────────────────────────────────────────────────────

type EventStat = {
  _id: string
  title: string
  institution: string
  status: string
  eventDate: number | null
  currency: string
  totalVotes: number
  totalRevenuePesewas: number
  totalCategories: number
  totalNominees: number
}

type TopNominee = {
  _id: string
  displayName: string
  totalVotes: number
  eventTitle: string
  categoryName: string
}

type CategoryBreakdown = {
  eventId: string
  categories: Array<{
    _id: string
    name: string
    nominees: Array<{ _id: string; displayName: string; totalVotes: number }>
  }>
}

// ── Event performance ─────────────────────────────────────────────────────────

type PerfMode = "votes" | "revenue"

function EventPerformance({ events }: { events: EventStat[] }) {
  const [mode, setMode] = useState<PerfMode>("votes")

  const sorted = [...events].sort((a, b) =>
    mode === "votes"
      ? b.totalVotes - a.totalVotes
      : b.totalRevenuePesewas - a.totalRevenuePesewas,
  )

  const max =
    mode === "votes"
      ? Math.max(...events.map((e) => e.totalVotes), 1)
      : Math.max(...events.map((e) => e.totalRevenuePesewas), 1)

  const barColors = ["bg-chart-1", "bg-chart-2", "bg-chart-4", "bg-chart-5"]

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
        {sorted.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">No events yet.</p>
        ) : (
          sorted.map((event, i) => {
            const pct =
              mode === "votes"
                ? (event.totalVotes / max) * 100
                : (event.totalRevenuePesewas / max) * 100
            const label =
              mode === "votes"
                ? event.totalVotes.toLocaleString()
                : formatCurrency(event.totalRevenuePesewas, event.currency)

            return (
              <div key={event._id} className="space-y-1.5">
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
          })
        )}
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

function TopNominees({ nominees }: { nominees: TopNominee[] }) {
  const maxVotes = nominees[0]?.totalVotes ?? 1

  return (
    <Card className="flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-bold">Top Nominees by Votes</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 space-y-3">
        {nominees.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">No nominees yet.</p>
        ) : (
          nominees.map((n, i) => {
            const pct = (n.totalVotes / maxVotes) * 100
            return (
              <div key={n._id} className="space-y-1">
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
                    <p className="font-medium truncate">{n.displayName}</p>
                    <p className="text-muted-foreground truncate">{n.categoryName}</p>
                  </div>
                  <span className="font-semibold tabular-nums shrink-0">{n.totalVotes.toLocaleString()}</span>
                </div>
                <Bar pct={pct} className={i === 0 ? "bg-amber-400" : "bg-primary/60"} />
              </div>
            )
          })
        )}
      </CardContent>
    </Card>
  )
}

// ── Category breakdown ────────────────────────────────────────────────────────

function CategoryBreakdown({
  events,
  breakdowns,
}: {
  events: EventStat[]
  breakdowns: CategoryBreakdown[]
}) {
  const eventsWithCategories = events.filter((e) => e.totalCategories > 0)
  const [selectedId, setSelectedId] = useState(eventsWithCategories[0]?._id ?? "")

  const breakdown = breakdowns.find((b) => b.eventId === selectedId)
  const categories = breakdown?.categories ?? []

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
              <SelectItem key={e._id} value={e._id}>{e.title}</SelectItem>
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
              const catTotal = cat.nominees.reduce((sum, n) => sum + n.totalVotes, 0) || 1
              const sorted = [...cat.nominees].sort((a, b) => b.totalVotes - a.totalVotes)
              return (
                <div key={cat._id} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold">{cat.name}</p>
                    <span className="text-xs text-muted-foreground">
                      {catTotal.toLocaleString()} votes
                    </span>
                  </div>
                  <div className="space-y-2">
                    {sorted.map((nominee, i) => {
                      const pct = (nominee.totalVotes / catTotal) * 100
                      return (
                        <div key={nominee._id} className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-1.5 min-w-0">
                              {i === 0 && <Trophy className="size-3 text-amber-500 shrink-0" />}
                              <span className={cn("truncate", i === 0 ? "font-semibold" : "")}>
                                {nominee.displayName}
                              </span>
                            </div>
                            <span className="text-muted-foreground shrink-0 ml-2">
                              {nominee.totalVotes.toLocaleString()} ({Math.round(pct)}%)
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

function EventSummaryTable({ events }: { events: EventStat[] }) {
  const totalVotes   = events.reduce((sum, e) => sum + e.totalVotes, 0)
  const totalRevenue = events.reduce((sum, e) => sum + e.totalRevenuePesewas, 0)
  const primaryCurrency = events[0]?.currency ?? "GHS"

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
              {events.map((event) => (
                <tr key={event._id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-5 py-3">
                    <div>
                      <p className="font-medium leading-snug">{event.title}</p>
                      <div className="flex items-center gap-1.5 mt-1">
                        <Building2 className="size-3 text-muted-foreground shrink-0" />
                        <span className="text-muted-foreground truncate max-w-[180px]">
                          {event.institution || "—"}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right text-muted-foreground hidden sm:table-cell whitespace-nowrap">
                    {formatDate(event.eventDate)}
                  </td>
                  <td className="px-4 py-3 text-right font-semibold tabular-nums">
                    {event.totalVotes.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-right text-muted-foreground hidden md:table-cell">
                    {event.totalNominees}
                  </td>
                  <td className="px-5 py-3 text-right font-semibold tabular-nums">
                    {formatCurrency(event.totalRevenuePesewas, event.currency)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t bg-muted/20">
                <td className="px-5 py-3 font-bold text-sm" colSpan={2}>Total</td>
                <td className="px-4 py-3 text-right font-bold tabular-nums hidden sm:table-cell">
                  {totalVotes.toLocaleString()}
                </td>
                <td className="px-4 py-3 text-right font-bold tabular-nums hidden md:table-cell" />
                <td className="px-5 py-3 text-right font-bold tabular-nums">
                  {formatCurrency(totalRevenue, primaryCurrency)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}

// ── Skeleton loaders ──────────────────────────────────────────────────────────

function AnalyticsSkeleton() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-7 w-28 mb-1.5" />
        <Skeleton className="h-4 w-64" />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => <KpiSkeleton key={i} />)}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card><CardContent className="p-5"><Skeleton className="h-40 w-full" /></CardContent></Card>
        <Card><CardContent className="p-5"><Skeleton className="h-40 w-full" /></CardContent></Card>
      </div>
      <Card><CardContent className="p-5"><Skeleton className="h-48 w-full" /></CardContent></Card>
      <Card><CardContent className="p-5"><Skeleton className="h-32 w-full" /></CardContent></Card>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

export function UserAnalytics() {
  const data = useQuery(api.dashboard.analyticsOverview)

  if (data === undefined) return <AnalyticsSkeleton />

  if (data === null || data.eventStats.length === 0) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Analytics"
          description="Performance overview across all your events."
        />
        <Card>
          <CardContent className="p-10 text-center text-sm text-muted-foreground">
            No events yet. Create your first event to see analytics here.
          </CardContent>
        </Card>
      </div>
    )
  }

  const { eventStats, topNominees, categoryBreakdowns } = data

  const totalVotes   = eventStats.reduce((sum, e) => sum + e.totalVotes, 0)
  const totalRevenue = eventStats.reduce((sum, e) => sum + e.totalRevenuePesewas, 0)
  const liveEvents   = eventStats.filter((e) => e.status === "live").length
  const totalNominees = eventStats.reduce((sum, e) => sum + e.totalNominees, 0)
  const primaryCurrency = eventStats[0]?.currency ?? "GHS"

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
          value={formatCurrency(totalRevenue, primaryCurrency)}
          icon={Wallet}
          trend="up"
          sub="across all events"
        />
        <KpiCard
          label="Total Votes"
          value={totalVotes}
          icon={Vote}
          trend="up"
          sub="cumulative"
        />
        <KpiCard
          label="Live Events"
          value={liveEvents}
          icon={CalendarDays}
          trend={liveEvents > 0 ? "up" : "flat"}
          sub={`of ${eventStats.length} total`}
        />
        <KpiCard
          label="Total Nominees"
          value={totalNominees}
          icon={Users}
          trend="flat"
          sub="across all events"
        />
      </div>

      {/* Event performance + top nominees */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <EventPerformance events={eventStats} />
        <TopNominees nominees={topNominees} />
      </div>

      {/* Category breakdown */}
      <CategoryBreakdown events={eventStats} breakdowns={categoryBreakdowns} />

      {/* Summary table */}
      <EventSummaryTable events={eventStats} />
    </div>
  )
}
