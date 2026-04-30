"use client";

import Link from "next/link";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { EventHeader } from "./event-header";
import { CategoriesList } from "./categories-list";
import { EventSidebar } from "./event-sidebar";
import type { RichEventDetail, ComputedStats, EventControls, CategoryDetail } from "./events";
import { formatCurrency } from "./events";
import { toast } from "sonner";

interface Props {
  base: string;
  eventId: string;
}

function EventDetailSkeleton() {
  return (
    <div className="space-y-4 md:space-y-5">
      <Card>
        <CardContent className="py-5 space-y-4">
          <div className="space-y-2">
            <Skeleton className="h-6 w-64" />
            <Skeleton className="h-4 w-48" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-1">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-3 w-20" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function EventDetail({ base, eventId }: Props) {
  const convexId = eventId as Id<"events">;

  const event       = useQuery(api.events.getByIdForOrganizer, { eventId: convexId });
  const statsData   = useQuery(api.dashboard.eventStats,     { eventId: convexId });
  const leaderboard = useQuery(api.dashboard.leaderboard,    { eventId: convexId });

  const updateSettings = useMutation(api.events.updateLiveSettings);

  // Loading
  if (event === undefined) return <EventDetailSkeleton />;

  // Not found or unauthorized
  if (event === null) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-2 text-center">
        <p className="font-semibold text-lg">Event not found</p>
        <Link href={`${base}/events`} className="text-sm text-primary hover:underline">
          Back to events
        </Link>
      </div>
    );
  }

  const currency = event.currency ?? "GHS";

  // Build categories from leaderboard (organizer always sees votes regardless of showVotes)
  const categories: CategoryDetail[] = (leaderboard ?? []).map(({ category, nominees }) => ({
    id: category._id as string,
    name: category.name,
    description: category.description ?? "",
    nominees: nominees.map((n) => ({
      id: n._id as string,
      name: n.displayName,
      votes: n.totalVotes,
    })),
  }));

  // Compute stats from Convex aggregates + leaderboard
  const totalVotes      = statsData?.totalVotes ?? 0;
  const totalCategories = statsData?.categoriesCount ?? 0;
  const totalNominees   = categories.reduce((sum, c) => sum + c.nominees.length, 0);
  const revenueRaw      = (statsData?.organizerAmountPesewas ?? 0) / 100;
  const priceGhs        = event.pricePerVotePesewas / 100;

  const computedStats: ComputedStats = {
    totalVotes,
    totalCategories,
    totalNominees,
    revenueRaw,
    revenue:    formatCurrency(revenueRaw, currency),
    priceLabel: `${formatCurrency(priceGhs, currency)} / vote`,
  };

  const richEvent: RichEventDetail = {
    id:           event._id as string,
    title:        event.title,
    institution:  event.institution ?? "",
    description:  event.description ?? "",
    location:     event.location ?? "",
    date:         event.eventDate ? new Date(event.eventDate).toISOString() : "",
    status:       event.status,
    currency,
    pricePerVote: priceGhs,
    closesDate:   event.votingEndsAt ? new Date(event.votingEndsAt).toISOString() : "",
    votesThisHour: statsData?.votesLastHour ?? 0,
    createdAt:    new Date(event.createdAt).toISOString(),
    controls: {
      showVotes:              event.showVotes,
      votingOpen:             event.votingOpen,
      publicPage:             event.publicPageVisible,
      nominationsOpen:        event.nominationsOpen,
      autoPublishNominations: event.nominationAutoApprove ?? false,
    },
    categories,
  };

  // Map EventControls key → updateLiveSettings field name
  const CONTROL_FIELD_MAP: Record<keyof EventControls, string> = {
    showVotes:              "showVotes",
    votingOpen:             "votingOpen",
    publicPage:             "publicPageVisible",
    nominationsOpen:        "nominationsOpen",
    autoPublishNominations: "nominationAutoApprove",
  };

  function handleToggle(key: keyof EventControls, value: boolean) {
    updateSettings({ eventId: convexId, [CONTROL_FIELD_MAP[key]]: value }).catch(() => {
      toast.error("Failed to update setting. Please try again.");
    });
  }

  return (
    <div className="space-y-4 md:space-y-5">
      <EventHeader event={richEvent} stats={computedStats} base={base} />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-4 md:gap-5 items-start">
        <CategoriesList categories={categories} />

        <EventSidebar
          stats={computedStats}
          closesDate={richEvent.closesDate}
          createdAt={richEvent.createdAt}
          controls={richEvent.controls}
          onToggle={handleToggle}
        />
      </div>
    </div>
  );
}
