"use client";

import { useState } from "react";
import Link from "next/link";
import { EventHeader } from "./event-header";
import { CategoriesList } from "./categories-list";
import { EventSidebar } from "./event-sidebar";
import { MOCK_EVENT_DETAILS, computeStats } from "./events";
import type { EventControls } from "./events";

interface Props {
  base: string;
  eventId: string;
}

export function EventDetail({ base, eventId }: Props) {
  const raw = MOCK_EVENT_DETAILS[eventId];

  const [controls, setControls] = useState<EventControls>(
    raw
      ? { ...raw.controls }
      : { showVotes: false, votingOpen: false, publicPage: false, nominationsOpen: false, autoPublishNominations: false }
  );

  if (!raw) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-2 text-center">
        <p className="font-semibold text-lg">Event not found</p>
        <Link href={`${base}/events`} className="text-sm text-primary hover:underline">
          Back to events
        </Link>
      </div>
    );
  }

  function handleToggle(key: keyof EventControls, value: boolean) {
    const next = { ...controls, [key]: value };
    setControls(next);
    console.log("[EventDetail] controls updated:", next);
  }

  const event = { ...raw, controls };
  const stats = computeStats(event);

  console.log("[EventDetail] event:", event);
  console.log("[EventDetail] computed stats:", stats);

  return (
    <div className="space-y-4 md:space-y-5">
      <EventHeader event={event} stats={stats} base={base} />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-4 md:gap-5 items-start">
        <CategoriesList categories={event.categories} />

        <EventSidebar
          stats={stats}
          closesDate={event.closesDate}
          createdAt={event.createdAt}
          controls={controls}
          onToggle={handleToggle}
        />
      </div>
    </div>
  );
}
