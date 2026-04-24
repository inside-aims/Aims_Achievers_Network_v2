"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Building2,
  MoreHorizontal,
  Pencil,
  UserPlus,
  Share2,
  Download,
  Trash2,
  TrendingUp,
  TrendingDown,
  Minus,
  Tag,
  Users,
  Lock,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/date-utils";
import { StatusBadge } from "../../shared/status-badge";
import { AddNomineeDialog } from "./add-nominee-dialog";
import type { RichEventDetail, ComputedStats } from "./events";

interface ActionItem {
  icon:         LucideIcon;
  label:        string;
  separator?:   boolean;
  variant?:     "default" | "destructive";
  onClick?:     () => void;
  href?:        string;
  disabledWhen?: string[];
}

interface StatPillProps {
  label: string;
  value: string | number;
  sub?:  string;
  trend?: "up" | "down" | "flat";
  icon?:  LucideIcon;
}

function StatPill({ label, value, sub, trend, icon: Icon }: StatPillProps) {
  const trendIcon =
    trend === "up"   ? TrendingUp   :
    trend === "down" ? TrendingDown :
    trend === "flat" ? Minus        : null;

  const trendColor =
    trend === "up"   ? "text-emerald-600 dark:text-emerald-400" :
    trend === "down" ? "text-red-500 dark:text-red-400"         :
    "text-muted-foreground";

  const TrendIcon = trendIcon;

  return (
    <div className="flex flex-col gap-0.5 md:gap-1 min-w-0">
      <div className="flex items-center gap-1 md:gap-1.5">
        {Icon && <Icon className="size-3 md:size-3.5 text-muted-foreground shrink-0" />}
        <span className="text-lg md:text-xl font-bold tabular-nums leading-tight truncate">
          {typeof value === "number" ? value.toLocaleString() : value}
        </span>
      </div>
      <div className="flex items-center gap-1 flex-wrap">
        <span className="text-[10px] md:text-xs text-muted-foreground">{label}</span>
        {TrendIcon && (
          <span className={cn("flex items-center gap-0.5 text-[10px] font-medium", trendColor)}>
            <TrendIcon className="size-2.5 md:size-3" />
            {sub && <span className="hidden sm:inline">{sub}</span>}
          </span>
        )}
      </div>
    </div>
  );
}

export interface TicketHeaderStats {
  sold:    number;
  revenue: string;
  types:   number;
  scans:   number;
}

interface Props {
  event:        RichEventDetail;
  stats:        ComputedStats;
  base:         string;
  activeTab?:   string;
  ticketStats?: TicketHeaderStats;
}

export function EventHeader({ event, stats, base, activeTab, ticketStats }: Props) {
  const [nomineeDialogOpen, setNomineeDialogOpen] = useState(false);

  async function handleShare() {
    const url = `${window.location.origin}/events/${event.id}`;
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Copied!", { description: "Link copied to clipboard." });
    } catch {
      toast.error("Could not copy link", {
        description: "Please copy the URL from your browser address bar.",
      });
    }
  }

  const isClosed = event.status === "closed";

  const actions: ActionItem[] = [
    {
      icon:         Pencil,
      label:        "Edit event",
      href:         `${base}/events/${event.id}/edit`,
      disabledWhen: ["closed"],
    },
    {
      icon:         UserPlus,
      label:        "Add nominee",
      separator:    true,
      disabledWhen: ["closed"],
      onClick:      () => setNomineeDialogOpen(true),
    },
    {
      icon:      Share2,
      label:     "Share public link",
      separator: true,
      onClick:   handleShare,
    },
    {
      icon:    Download,
      label:   "Export results",
      onClick: () => console.log("[EventHeader] Export:", event.id),
    },
    {
      icon:      Trash2,
      label:     "Delete event",
      separator: true,
      variant:   "destructive",
      onClick:   () => console.log("[EventHeader] Delete:", event.id),
    },
  ];

  const voteTrend = event.votesThisHour > 0 ? "up" : "flat";
  const voteSub   = event.votesThisHour > 0
    ? `${event.votesThisHour.toLocaleString()} this hour`
    : undefined;

  return (
    <>
      <div className="space-y-3">
        <Card>
          <CardContent className="py-5">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 space-y-2">
                <div className="flex flex-wrap items-center gap-2 md:gap-3">
                  <h1 className="text-base md:text-lg lg:text-xl font-bold tracking-tight leading-tight">
                    {event.title}
                  </h1>
                  <StatusBadge status={event.status} />
                </div>

                <div className="flex flex-wrap items-center gap-3 md:gap-4 text-[10px] md:text-xs text-muted-foreground">
                  {event.institution && (
                    <span className="flex items-center gap-1 md:gap-1.5">
                      <Building2 className="size-3 md:size-3.5 shrink-0" />
                      {event.institution}
                    </span>
                  )}
                  <span className="flex items-center gap-1 md:gap-1.5">
                    <MapPin className="size-3 md:size-3.5 shrink-0" />
                    {event.location}
                  </span>
                  <span className="flex items-center gap-1 md:gap-1.5">
                    <Calendar className="size-3 md:size-3.5 shrink-0" />
                    {formatDate(event.date)}
                  </span>
                </div>

                {event.description && (
                  <p className="text-xs text-muted-foreground line-clamp-1">
                    {event.description}
                  </p>
                )}
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="size-8 shrink-0">
                    <MoreHorizontal className="size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-52">
                  {isClosed && (
                    <>
                      <div className="flex items-center gap-1.5 px-2 py-1.5 text-[11px] text-muted-foreground">
                        <Lock className="size-3 shrink-0" />
                        <span>Some actions are locked for closed events</span>
                      </div>
                      <DropdownMenuSeparator />
                    </>
                  )}
                  {actions.map((action) => {
                    const isDisabled = action.disabledWhen?.includes(event.status) ?? false;
                    const useLink    = !isDisabled && !!action.href;
                    return (
                      <span key={action.label}>
                        {action.separator && <DropdownMenuSeparator />}
                        <DropdownMenuItem
                          disabled={isDisabled}
                          onClick={isDisabled ? undefined : action.onClick}
                          asChild={useLink}
                          className={cn(
                            "flex items-center gap-2",
                            !isDisabled && action.variant === "destructive" &&
                              "text-destructive focus:text-destructive",
                          )}
                        >
                          {useLink ? (
                            <Link href={action.href!}>
                              <action.icon className="size-3.5 shrink-0" />
                              <span className="flex-1">{action.label}</span>
                            </Link>
                          ) : (
                            <>
                              <action.icon className="size-3.5 shrink-0" />
                              <span className="flex-1">{action.label}</span>
                              {isDisabled && (
                                <Lock className="size-3 text-muted-foreground/60 shrink-0" />
                              )}
                            </>
                          )}
                        </DropdownMenuItem>
                      </span>
                    );
                  })}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="mt-4 md:mt-5 pt-4 md:pt-5 border-t grid grid-cols-2 sm:grid-cols-4 gap-x-4 md:gap-x-6 gap-y-3 md:gap-y-4">
              {activeTab === "tickets" && ticketStats ? (
                <>
                  <StatPill label="Tickets Sold"  value={ticketStats.sold}    icon={Tag}   />
                  <StatPill label="Ticket Revenue" value={ticketStats.revenue} icon={Users} />
                  <StatPill label="Ticket Types"   value={ticketStats.types}   icon={Tag}   />
                  <StatPill label="Total Scans"    value={ticketStats.scans}   icon={Users} />
                </>
              ) : (
                <>
                  <StatPill
                    label="Revenue"
                    value={stats.revenue}
                    trend={event.votesThisHour > 0 ? "up" : "flat"}
                  />
                  <StatPill
                    label="Votes cast"
                    value={stats.totalVotes}
                    trend={voteTrend}
                    sub={voteSub}
                  />
                  <StatPill label="Categories" value={stats.totalCategories} icon={Tag}   />
                  <StatPill label="Nominees"   value={stats.totalNominees}   icon={Users} />
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Nominee dialog — rendered outside the card so it portals correctly */}
      <AddNomineeDialog
        open={nomineeDialogOpen}
        onOpenChange={setNomineeDialogOpen}
        categories={event.categories}
        eventTitle={event.title}
      />
    </>
  );
}
