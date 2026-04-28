"use client";

import Link from "next/link";
import { BarChart3, Tag, Users, Coins } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { PageHeader } from "../../shared/page-header";
import { StatCard } from "../../shared/stat-card";
import { StatusBadge } from "../../shared/status-badge";
import { CategoriesList } from "@/components/features/dashboard/user/events/categories-list";
import type { CategoryDetail } from "@/components/features/dashboard/user/events/events";

interface Props {
  base:    string;
  eventId: string;
}

function EventDetailSkeleton() {
  return (
    <div className="space-y-5 animate-pulse">
      <div className="h-8 w-64 bg-muted rounded" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-28 bg-muted rounded-xl" />)}
      </div>
      <div className="h-64 bg-muted rounded-xl" />
    </div>
  );
}

export function AdminEventDetail({ base, eventId }: Props) {
  const convexId     = eventId as Id<"events">;
  const data         = useQuery(api.admin.getAdminEventDetail, { eventId: convexId });
  const leaderboard  = useQuery(api.admin.adminLeaderboard,    { eventId: convexId });

  if (data === undefined) return <EventDetailSkeleton />;

  if (data === null) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-2 text-center">
        <p className="font-semibold text-lg">Event not found</p>
        <Link href={`${base}/events`} className="text-sm text-primary hover:underline">
          Back to events
        </Link>
      </div>
    );
  }

  const { event, organizerName, categoriesCount, nomineesCount, totalVotes, grossRevenuePesewas, platformFeePesewas } = data;

  const eventDate = event.eventDate
    ? new Date(event.eventDate).toLocaleDateString("en-GH", { day: "numeric", month: "short", year: "numeric" })
    : "";

  const categories: CategoryDetail[] = leaderboard
    ? leaderboard.map(({ category, nominees }) => ({
        id:          category._id,
        name:        category.name,
        description: category.description ?? "",
        nominees:    nominees.map((n) => ({
          id:    n._id,
          name:  n.displayName,
          votes: n.totalVotes,
        })),
      }))
    : [];

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3">
        <PageHeader title={event.title} />
        <StatusBadge status={event.status} />
      </div>

      <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-muted-foreground">
        {organizerName && <span>{organizerName}</span>}
        {event.institution && <span>{event.institution}</span>}
        {event.location && <span>{event.location}</span>}
        {eventDate && <span>{eventDate}</span>}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="Total Votes"  value={totalVotes}                                        sub="across all categories"    icon={BarChart3} />
        <StatCard label="Revenue"      value={`GHS ${(grossRevenuePesewas / 100).toLocaleString()}`} sub="gross revenue"        icon={Coins}     variant="success" />
        <StatCard label="Categories"   value={categoriesCount}                                   sub="award categories"          icon={Tag}       variant="info" />
        <StatCard label="Nominees"     value={nomineesCount}                                     sub="across all categories"     icon={Users}     variant="warning" />
      </div>

      {leaderboard !== undefined && categories.length > 0 && (
        <CategoriesList categories={categories} />
      )}
    </div>
  );
}
