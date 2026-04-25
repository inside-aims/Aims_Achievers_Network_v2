"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EventHeader } from "./event-header";
import { CategoriesList } from "./categories-list";
import { EventSidebar } from "./event-sidebar";
import { EventTicketsSection } from "./event-tickets-section";
import { MOCK_EVENT_DETAILS, computeStats } from "./events";
import {
  getEventTicketInfo,
  getEventScanCodes,
} from "@/components/features/tickets/mock-data";
import type { EventControls } from "./events";
import type { TicketHeaderStats } from "./event-header";

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

  const [activeTab, setActiveTab] = useState("voting");

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
    setControls((prev) => ({ ...prev, [key]: value }));
  }

  const event = { ...raw, controls };
  const stats = computeStats(event);

  const ticketHeaderStats = useMemo((): TicketHeaderStats | undefined => {
    if (!event.ticketingEnabled || !event.ticketEventId) return undefined;
    const info = getEventTicketInfo(event.ticketEventId);
    const codes = getEventScanCodes(event.ticketEventId);
    if (!info) return undefined;
    const sold = info.ticketTypes.reduce((s, t) => s + t.quantitySold, 0);
    const revenuePesewas = info.ticketTypes.reduce(
      (s, t) => s + t.quantitySold * t.pricePesewas,
      0
    );
    const scans = codes.reduce((s, c) => s + c.scans.length, 0);
    return {
      sold,
      revenue: `GHS ${(revenuePesewas / 100).toFixed(2)}`,
      types: info.ticketTypes.length,
      scans,
    };
  }, [event.ticketingEnabled, event.ticketEventId]);

  const overviewGrid = (
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
  );

  return (
    <div className="space-y-4 md:space-y-5">
      <EventHeader
        event={event}
        stats={stats}
        base={base}
        activeTab={activeTab}
        ticketStats={ticketHeaderStats}
      />

      {event.ticketingEnabled && event.ticketEventId ? (
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="voting">Voting</TabsTrigger>
            <TabsTrigger value="tickets">Tickets</TabsTrigger>
          </TabsList>
          <TabsContent value="voting" className="mt-4">
            {overviewGrid}
          </TabsContent>
          <TabsContent value="tickets" className="mt-4">
            <EventTicketsSection eventId={event.ticketEventId} />
          </TabsContent>
        </Tabs>
      ) : (
        overviewGrid
      )}
    </div>
  );
}
