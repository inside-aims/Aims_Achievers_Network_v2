"use client";

import { useMemo, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import EventCard from "@/components/features/events/event-card";
import EmptyState from "@/components/shared/empty-state";
import { EventStatus } from "@/components/features/events/index";
import SearchBar from "@/components/shared/search-bar";
import { getDaysLeft } from "@/lib/utils";
import { useEvents } from "@/hooks/use-events";
import { EventCardSkeleton } from "@/components/ui/skeleton";

const EventsListing = () => {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<EventStatus>("all");
  const { events, loading, error } = useEvents();

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const matchesSearch = event.title.toLowerCase().includes(query.toLowerCase());
      const daysLeft = getDaysLeft(event.endDate);
      const matchesStatus =
        status === "all" ? true : status === "active" ? daysLeft > 0 : daysLeft <= 0;
      return matchesSearch && matchesStatus;
    });
  }, [events, query, status]);

  return (
    <section className="flex flex-col gap-4 md:gap-8 min-h-screen">
      <div className="parent-header">
        <h2 className="feature-header">Make Your Vote Count</h2>
        <p className="feature-subheader max-w-2xl">
          Find events that matter to you and take part in decisions that shape real outcomes.
        </p>
      </div>

      {/* Search and filter */}
      <div className="flex flex-row items-center justify-between gap-2 md:gap-4">
        <SearchBar query={query} setQuery={setQuery} placeholder="Search event" />
        <Select value={status} onValueChange={(v) => setStatus(v as EventStatus)}>
          <SelectTrigger className="w-[180px] py-5">
            <SelectValue placeholder="Filter events" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Events</SelectItem>
            <SelectItem value="active">Active Events</SelectItem>
            <SelectItem value="past">Past Events</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        <div className="flex-1 h-px bg-border" />
        <span className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
          {`${status} Events`}
        </span>
        <div className="flex-1 h-px bg-border" />
      </div>

      {/* Loading state */}
      {loading && (
        <div className="grid gap-4 md:gap-8 sm:grid-cols-1 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <EventCardSkeleton key={i} />
          ))}
        </div>
      )}

      {/* Error state */}
      {!loading && error && (
        <p className="text-center text-destructive py-10">{error}</p>
      )}

      {/* Events grid */}
      {!loading && !error && filteredEvents.length > 0 && (
        <div className="grid gap-4 md:gap-8 sm:grid-cols-1 lg:grid-cols-3">
          {filteredEvents.map((event) => (
            <EventCard key={event.eventId} {...event} />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && filteredEvents.length === 0 && (
        <EmptyState onReset={() => { setStatus("all"); setQuery(""); }} />
      )}
    </section>
  );
};

export default EventsListing;
