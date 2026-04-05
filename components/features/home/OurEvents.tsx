"use client";

import EventNameTag from "../../ui/event-card";
import Link from "next/link";
import { useEvents } from "@/hooks/use-events";
import { HomeEventCardSkeleton } from "@/components/ui/skeleton";
import { getDaysLeft } from "@/lib/utils";

export default function OurEvents() {
  const { events, loading } = useEvents();
  const preview = events.slice(0, 3);

  return (
    <section className="bg-muted/30 text-foreground feature-no py-20 md:py-28">
      {/* Header row */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12 md:mb-14">
        <div>
          <span className="text-xs tracking-[0.25em] font-mono text-muted-foreground">
            OUR EVENTS
          </span>
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light font-serif tracking-tight leading-[1.05] mt-4">
            Event Sneak Peek
          </h2>
        </div>
        <Link
          href="/events"
          className="group flex items-center gap-2 text-sm font-mono tracking-[0.2em] text-muted-foreground hover:text-foreground transition-colors duration-300 shrink-0"
        >
          VIEW ALL
          <svg
            width="16"
            height="8"
            viewBox="0 0 22 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="group-hover:translate-x-1 transition-transform duration-300"
          >
            <path
              d="M21.5303 6.53033C21.8232 6.23744 21.8232 5.76256 21.5303 5.46967L16.7574 0.696699C16.4645 0.403806 15.9896 0.403806 15.6967 0.696699C15.4038 0.989592 15.4038 1.46447 15.6967 1.75736L19.9393 6L15.6967 10.2426C15.4038 10.5355 15.4038 11.0104 15.6967 11.3033C15.9896 11.5962 16.4645 11.5962 16.7574 11.3033L21.5303 6.53033ZM0 6.75L21 6.75V5.25L0 5.25L0 6.75Z"
              fill="currentColor"
            />
          </svg>
        </Link>
      </div>

      <p className="text-base sm:text-lg font-light text-muted-foreground max-w-2xl mb-12 md:mb-14 leading-relaxed">
        Each event is thoughtfully crafted — not just to happen, but to be remembered. From the
        first nomination to the final applause.
      </p>

      {/* Event cards */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {Array.from({ length: 3 }).map((_, i) => (
            <HomeEventCardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {preview.map((event) => {
            const daysLeft = getDaysLeft(event.endDate);
            const status = daysLeft > 30 ? "upcoming" : daysLeft > 0 ? "ongoing" : "past";
            return (
              <EventNameTag
                key={event.eventId}
                eventName={event.title}
                location="Koforidua"
                status={status}
                imageUrl={event.image}
              />
            );
          })}
        </div>
      )}
    </section>
  );
}
