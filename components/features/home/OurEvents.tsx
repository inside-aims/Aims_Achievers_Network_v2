"use client";

import EventNameTag from "../../ui/event-card";
import Link from "next/link";
import { useEvents } from "@/hooks/use-events";
import { HomeEventCardSkeleton } from "@/components/ui/skeleton";
import { getDaysLeft } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

export default function OurEvents() {
  const { events, loading } = useEvents();
  const preview = events.slice(0, 3);

  return (
    <section className="bg-muted/20 text-foreground feature-no py-20 md:py-28">
      {/* Header row */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-6">
        <div>
          <span className="text-xs tracking-[0.25em] font-mono text-muted-foreground">
            OUR EVENTS
          </span>
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light font-serif tracking-tight leading-[1.0] mt-4">
            Events worth
            <br />
            <span className="text-muted-foreground/60">recognizing.</span>
          </h2>
        </div>
        <Link
          href="/events"
          className="group flex items-center gap-2 text-sm font-mono tracking-[0.2em] text-muted-foreground hover:text-foreground transition-colors duration-300 shrink-0 pb-1"
        >
          VIEW ALL
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
        </Link>
      </div>

      <p className="text-base font-light text-muted-foreground max-w-xl mb-12 md:mb-16 leading-relaxed">
        Every event is thoughtfully designed to celebrate excellence from the first nomination to the final moment of recognition.
        A seamless journey that honors impact, creativity, and distinction.
      </p>

      {/* Event cards */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <HomeEventCardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {preview.map((event) => {
            const daysLeft = getDaysLeft(event.endDate);
            const status =
              daysLeft > 30 ? "upcoming" : daysLeft > 0 ? "ongoing" : "past";
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
