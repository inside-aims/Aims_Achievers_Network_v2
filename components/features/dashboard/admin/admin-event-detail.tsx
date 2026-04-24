import Link from "next/link";
import { ArrowLeft, BarChart2, Tag, Users, Coins } from "lucide-react";
import { PageHeader } from "@/components/features/dashboard/shared/page-header";
import { StatCard } from "@/components/features/dashboard/shared/stat-card";
import { StatusBadge } from "@/components/features/dashboard/shared/status-badge";
import { CategoriesList } from "@/components/features/dashboard/user/events/categories-list";
import { EventTicketsSection } from "@/components/features/dashboard/user/events/event-tickets-section";
import { MOCK_EVENT_DETAILS, computeStats } from "@/components/features/dashboard/user/events/events";

interface Props {
  base: string;
  eventId: string;
}

export function AdminEventDetail({ base, eventId }: Props) {
  const event = MOCK_EVENT_DETAILS[eventId];

  if (!event) {
    return (
      <div className="dash-page flex flex-col items-center justify-center min-h-[60vh] gap-2 text-center">
        <p className="font-semibold text-lg">Event not found</p>
        <Link href={`${base}/events`} className="text-sm text-primary hover:underline">
          Back to events
        </Link>
      </div>
    );
  }

  const stats = computeStats(event);

  return (
    <div className="dash-page space-y-5">
      <div className="flex flex-wrap items-center gap-3">
        <PageHeader title={event.title} />
        <StatusBadge status={event.status} />
      </div>

      {/* Event metadata */}
      <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-muted-foreground">
        <span>{event.institution}</span>
        <span>{event.location}</span>
        <span>{event.date}</span>
        {event.eventTime && <span>{event.eventTime}</span>}
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard
          label="Total Votes"
          value={stats.totalVotes}
          sub={stats.priceLabel}
          icon={BarChart2}
        />
        <StatCard
          label="Revenue"
          value={stats.revenue}
          sub="gross revenue"
          icon={Coins}
          variant="success"
        />
        <StatCard
          label="Categories"
          value={stats.totalCategories}
          sub="award categories"
          icon={Tag}
          variant="info"
        />
        <StatCard
          label="Nominees"
          value={stats.totalNominees}
          sub="across all categories"
          icon={Users}
          variant="warning"
        />
      </div>

      {/* Ticketing section — read-only */}
      {event.ticketingEnabled && event.ticketEventId && (
        <div className="space-y-2">
          <p className="text-sm font-semibold">Ticketing</p>
          <EventTicketsSection eventId={event.ticketEventId} readonly />
        </div>
      )}

      {/* Categories */}
      {event.categories.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-semibold">Categories</p>
          <CategoriesList categories={event.categories} />
        </div>
      )}
    </div>
  );
}
