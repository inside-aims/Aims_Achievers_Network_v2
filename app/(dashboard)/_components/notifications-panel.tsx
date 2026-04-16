"use client"

import { useState } from "react"
import {
  Bell,
  TrendingUp,
  Clock,
  Wallet,
  BarChart3,
  UserPlus,
  CheckCheck,
  Sparkles,
  ChevronLeft,
  Calendar,
  X,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { formatRelative, formatDateTime } from "@/lib/date-utils"

// ── Types ─────────────────────────────────────────────────────────────────────

type NotifType = "milestone" | "closing" | "revenue" | "summary" | "nominee"
type FilterTab  = "all" | "unread"
type Screen     = "list" | "detail"

interface Notification {
  id:          string
  type:        NotifType
  title:       string
  description: string
  time:        string
  read:        boolean
}

// ── Type config ───────────────────────────────────────────────────────────────

const TYPE_CONFIG: Record<
  NotifType,
  { icon: LucideIcon; label: string; color: string; bg: string; accent: string }
> = {
  milestone: {
    icon:   TrendingUp,
    label:  "Vote Milestone",
    color:  "text-blue-600 dark:text-blue-400",
    bg:     "bg-blue-100 dark:bg-blue-900/40",
    accent: "bg-blue-500",
  },
  closing: {
    icon:   Clock,
    label:  "Event Closing",
    color:  "text-amber-600 dark:text-amber-400",
    bg:     "bg-amber-100 dark:bg-amber-900/40",
    accent: "bg-amber-500",
  },
  revenue: {
    icon:   Wallet,
    label:  "Revenue",
    color:  "text-emerald-600 dark:text-emerald-400",
    bg:     "bg-emerald-100 dark:bg-emerald-900/40",
    accent: "bg-emerald-500",
  },
  summary: {
    icon:   BarChart3,
    label:  "Weekly Summary",
    color:  "text-violet-600 dark:text-violet-400",
    bg:     "bg-violet-100 dark:bg-violet-900/40",
    accent: "bg-violet-500",
  },
  nominee: {
    icon:   UserPlus,
    label:  "Nominee",
    color:  "text-teal-600 dark:text-teal-400",
    bg:     "bg-teal-100 dark:bg-teal-900/40",
    accent: "bg-teal-500",
  },
}

// ── Mock data ─────────────────────────────────────────────────────────────────

const INITIAL: Notification[] = [
  {
    id:          "n1",
    type:        "milestone",
    title:       "Vote milestone reached",
    description: "FAST Excellence Awards just crossed 7,000 votes. Your event is gaining great traction — keep the momentum going!",
    time:        "2026-04-11T09:15:00Z",
    read:        false,
  },
  {
    id:          "n2",
    type:        "closing",
    title:       "Voting closes soon",
    description: "FBMS Business Awards voting closes in 48 hours. Make sure all nominees are confirmed and your audience is notified.",
    time:        "2026-04-11T07:30:00Z",
    read:        false,
  },
  {
    id:          "n3",
    type:        "revenue",
    title:       "Revenue milestone",
    description: "You've now earned GHS 7,530 across your active events. Your payout will be processed once voting closes.",
    time:        "2026-04-11T06:00:00Z",
    read:        false,
  },
  {
    id:          "n4",
    type:        "nominee",
    title:       "New nominee added",
    description: "A nominee was added to Best Entrepreneur in FBMS Business Awards. Review the entry to make sure everything looks good.",
    time:        "2026-04-09T14:20:00Z",
    read:        true,
  },
  {
    id:          "n5",
    type:        "summary",
    title:       "Weekly summary ready",
    description: "This week: 2 live events, 1,840 new votes, GHS 1,840 earned. Your top event is FAST Excellence Awards with 340 votes this hour.",
    time:        "2026-04-07T08:00:00Z",
    read:        true,
  },
  {
    id:          "n6",
    type:        "milestone",
    title:       "Vote milestone reached",
    description: "FOE Engineering Awards crossed 2,500 votes before closing. A strong finish for this event.",
    time:        "2026-04-03T11:00:00Z",
    read:        true,
  },
  {
    id:          "n7",
    type:        "closing",
    title:       "Event voting ended",
    description: "FOE Engineering Awards 2025 voting has officially closed. You can now view final results and export the report.",
    time:        "2026-04-01T18:00:00Z",
    read:        true,
  },
]

// ── Grouping ──────────────────────────────────────────────────────────────────

const NOW          = new Date("2026-04-11T12:00:00Z")
const GROUP_ORDER  = ["today", "week", "earlier"] as const
const GROUP_LABELS = { today: "Today", week: "This Week", earlier: "Earlier" } as const

function getGroup(iso: string): "today" | "week" | "earlier" {
  const diff = (NOW.getTime() - new Date(iso).getTime()) / 86_400_000
  if (diff < 1) return "today"
  if (diff < 7) return "week"
  return "earlier"
}

// ── Group divider ─────────────────────────────────────────────────────────────

function GroupDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 px-4 py-2">
      <div className="h-px flex-1 bg-border" />
      <span className="text-[10px] font-semibold tracking-widest uppercase text-muted-foreground">
        {label}
      </span>
      <div className="h-px flex-1 bg-border" />
    </div>
  )
}

// ── Filter tabs ───────────────────────────────────────────────────────────────

function FilterTabs({
  active,
  onChange,
  unreadCount,
}: {
  active:      FilterTab
  onChange:    (t: FilterTab) => void
  unreadCount: number
}) {
  return (
    <div className="flex gap-1 p-1 bg-muted/60 rounded-lg mx-4 mb-3">
      {(["all", "unread"] as FilterTab[]).map((tab) => (
        <button
          key={tab}
          type="button"
          onClick={() => onChange(tab)}
          className={cn(
            "flex-1 py-1.5 text-xs font-medium rounded-md transition-all capitalize",
            active === tab
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {tab}
          {tab === "unread" && unreadCount > 0 && (
            <span className="ml-1.5 inline-flex size-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground">
              {unreadCount}
            </span>
          )}
        </button>
      ))}
    </div>
  )
}

// ── Single notification item ──────────────────────────────────────────────────

function NotifItem({
  notif,
  onClick,
}: {
  notif:   Notification
  onClick: (id: string) => void
}) {
  const cfg      = TYPE_CONFIG[notif.type]
  const TypeIcon = cfg.icon

  return (
    <button
      type="button"
      onClick={() => onClick(notif.id)}
      className={cn(
        "w-full text-left px-4 py-3.5 relative transition-colors group",
        notif.read ? "hover:bg-muted/30" : "bg-muted/50 hover:bg-muted/70",
      )}
    >
      {!notif.read && (
        <div className={cn("absolute left-0 top-3 bottom-3 w-[3px] rounded-r-full", cfg.accent)} />
      )}

      <div className="flex items-start gap-3">
        <div className={cn("size-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5", cfg.bg)}>
          <TypeIcon className={cn("size-[15px]", cfg.color)} />
        </div>

        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex items-start justify-between gap-2">
            <p className={cn("text-sm leading-snug", notif.read ? "font-medium" : "font-semibold")}>
              {notif.title}
            </p>
            <span className="text-[10px] text-muted-foreground whitespace-nowrap shrink-0 mt-0.5 tabular-nums">
              {formatRelative(notif.time)}
            </span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
            {notif.description}
          </p>
        </div>

        {!notif.read && (
          <div className="size-2 rounded-full bg-primary shrink-0 mt-1.5" />
        )}
      </div>
    </button>
  )
}

// ── Detail view ───────────────────────────────────────────────────────────────

function NotifDetail({
  notif,
  onBack,
}: {
  notif:  Notification
  onBack: () => void
}) {
  const cfg      = TYPE_CONFIG[notif.type]
  const TypeIcon = cfg.icon

  return (
    <div className="flex flex-col h-full">
      <SheetTitle className="sr-only">{notif.title}</SheetTitle>

      {/* Back bar */}
      <div className="flex items-center gap-1 px-3 py-2.5 border-b shrink-0">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="gap-1 h-8 px-2 text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="size-4" />
          <span className="text-xs font-medium">Back</span>
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5">
        {/* Icon + type label */}
        <div className="flex items-center gap-3">
          <div className={cn("size-12 rounded-2xl flex items-center justify-center shrink-0", cfg.bg)}>
            <TypeIcon className={cn("size-5", cfg.color)} />
          </div>
          <span className={cn(
            "text-xs font-bold tracking-wider uppercase px-2.5 py-1 rounded-full",
            cfg.bg, cfg.color,
          )}>
            {cfg.label}
          </span>
        </div>

        {/* Title */}
        <h2 className="text-lg font-bold leading-snug">{notif.title}</h2>

        {/* Description */}
        <p className="text-sm text-muted-foreground leading-relaxed">
          {notif.description}
        </p>

        {/* Divider */}
        <div className="h-px bg-border" />

        {/* Timestamp */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Calendar className="size-3.5 shrink-0" />
          <span>{formatDateTime(notif.time)}</span>
          <span className="text-border">·</span>
          <span>{formatRelative(notif.time)}</span>
        </div>
      </div>
    </div>
  )
}

// ── List view ─────────────────────────────────────────────────────────────────

function NotifList({
  notifications,
  filter,
  onFilterChange,
  onItemClick,
  onMarkAllRead,
}: {
  notifications:  Notification[]
  filter:         FilterTab
  onFilterChange: (f: FilterTab) => void
  onItemClick:    (id: string) => void
  onMarkAllRead:  () => void
}) {
  const unreadCount = notifications.filter((n) => !n.read).length
  const visible     =
    filter === "unread" ? notifications.filter((n) => !n.read) : notifications

  const grouped = GROUP_ORDER.reduce<Record<string, Notification[]>>(
    (acc, g) => { acc[g] = visible.filter((n) => getGroup(n.time) === g); return acc },
    { today: [], week: [], earlier: [] },
  )

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-5 pb-3 border-b shrink-0">
        <div className="flex items-center gap-2">
          <SheetTitle className="font-bold text-base">Notifications</SheetTitle>
          {unreadCount > 0 && (
            <span className="inline-flex items-center justify-center rounded-full bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5">
              {unreadCount} new
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onMarkAllRead}
              className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground gap-1"
            >
              <CheckCheck className="size-3.5" />
              Mark all read
            </Button>
          )}
          <SheetClose asChild>
            <Button variant="ghost" size="icon" className="size-7 text-muted-foreground hover:text-foreground" aria-label="Close">
              <X className="size-4" />
            </Button>
          </SheetClose>
        </div>
      </div>

      {/* Tabs */}
      <div className="pt-3 shrink-0">
        <FilterTabs active={filter} onChange={onFilterChange} unreadCount={unreadCount} />
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto">
        {visible.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-3 text-center px-8 py-16">
            <div className="size-14 rounded-2xl bg-muted flex items-center justify-center">
              <Sparkles className="size-6 text-muted-foreground/50" />
            </div>
            <div>
              <p className="font-semibold text-sm">All caught up</p>
              <p className="text-xs text-muted-foreground mt-1">
                {filter === "unread"
                  ? "No unread notifications right now."
                  : "Nothing to show here yet."}
              </p>
            </div>
          </div>
        ) : (
          GROUP_ORDER.map((group) => {
            const items = grouped[group]
            if (!items.length) return null
            return (
              <div key={group}>
                <GroupDivider label={GROUP_LABELS[group]} />
                <div className="divide-y divide-border/50">
                  {items.map((n) => (
                    <NotifItem key={n.id} notif={n} onClick={onItemClick} />
                  ))}
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

// ── Panel content (manages both screens) ─────────────────────────────────────

function NotificationsContent() {
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL)
  const [filter, setFilter]               = useState<FilterTab>("all")
  const [screen, setScreen]               = useState<Screen>("list")
  const [detailId, setDetailId]           = useState<string | null>(null)

  function markRead(id: string) {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  function markAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  function openDetail(id: string) {
    markRead(id)
    setDetailId(id)
    setScreen("detail")
  }

  function goBack() {
    setScreen("list")
    setDetailId(null)
  }

  if (screen === "detail" && detailId) {
    const notif = notifications.find((n) => n.id === detailId)
    if (notif) return <NotifDetail notif={notif} onBack={goBack} />
  }

  return (
    <NotifList
      notifications={notifications}
      filter={filter}
      onFilterChange={setFilter}
      onItemClick={openDetail}
      onMarkAllRead={markAllRead}
    />
  )
}

// ── Bell button (exported) ────────────────────────────────────────────────────

export function NotificationsBell() {
  const unreadCount = INITIAL.filter((n) => !n.read).length

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="size-8 relative" aria-label="Notifications">
          <Bell className="size-4" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 size-2 rounded-full bg-destructive ring-2 ring-background animate-pulse" />
          )}
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        showCloseButton={false}
        className="w-full sm:max-w-[380px] p-0 flex flex-col"
      >
        <NotificationsContent />
      </SheetContent>
    </Sheet>
  )
}
