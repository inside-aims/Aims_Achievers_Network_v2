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
import {EVENTS, EventStatus} from "@/components/features/events/index";
import SearchBar from "@/components/shared/search-bar";
import {getDaysLeft} from "@/lib/utils";

const EventsListing = () => {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<EventStatus>("all");

  // Handler for filtering events base on search input
  const filteredEvents = useMemo(() => {
    return EVENTS.filter((event) => {
      const matchesSearch =
        event.title.toLowerCase().includes(query.toLowerCase());

      const matchesStatus =
        status === "all" ? true : getDaysLeft(event.endDate) > 0 ? status === "active" : false;

      return matchesSearch && matchesStatus;
    });
  }, [query, status]);


  return (
    <section className="flex flex-col gap-4 md:gap-8">
      <div className="parent-header">
        <h2 className="feature-header">Make Your Vote Count</h2>
        <p className="feature-subheader max-w-2xl">
          Find events that matter to you and take part in decisions that shape real outcomes.
        </p>

      </div>

      {/*search and filter*/}
      <div className="flex flex-row items-center justify-between gap-2 md:gap-4">
        <SearchBar
          query={query}
          setQuery={setQuery}
          placeholder={"Search event"}
          />

        <Select
          value={status}
          onValueChange={(v) => setStatus(v as EventStatus)}
        >
          <SelectTrigger className="w-[180px] py-5">
            <SelectValue placeholder="Filter events"/>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Events</SelectItem>
            <SelectItem value="active">Active Events</SelectItem>
            <SelectItem value="past">Past Events</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center  gap-2 md:gap-4">
        <div className="flex-1 h-px bg-border" />
        <span className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
          {`${status} Events`}
        </span>
        <div className="flex-1 h-px bg-border" />
      </div>

      {/*List of events*/}
      {filteredEvents.length > 0 && (
        <div className="grid gap-4 md:gap-8 sm:grid-cols-1 lg:grid-cols-3">
          {filteredEvents.map((event) => (
            <EventCard key={event.eventId} {...event} />
          ))}
        </div>
      )}

      {/*No search events found.*/}
      {filteredEvents.length == 0 && (
        <EmptyState
          onReset={() => {
            setStatus("all");
            setQuery("")
          }}
        />
      )}
    </section>
  );
};

export default EventsListing;
