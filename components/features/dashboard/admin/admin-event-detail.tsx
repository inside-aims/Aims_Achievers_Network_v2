"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { BarChart2, Tag, Users, Coins, Ticket, ScanLine } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/features/dashboard/shared/page-header";
import { StatCard } from "@/components/features/dashboard/shared/stat-card";
import { StatusBadge } from "@/components/features/dashboard/shared/status-badge";
import { CategoriesList } from "@/components/features/dashboard/user/events/categories-list";
import { EventTicketsSection } from "@/components/features/dashboard/user/events/event-tickets-section";
import { MOCK_EVENT_DETAILS, computeStats } from "@/components/features/dashboard/user/events/events";
import {
  getEventTicketInfo,
  getEventScanCodes,
} from "@/components/features/tickets/mock-data";

interface Props {
  base: string;
  eventId: string;
}

export function AdminEventDetail({ base, eventId }: Props) {
  const event = MOCK_EVENT_DETAILS[eventId];
  const [activeTab, setActiveTab] = useState("voting");

  const ticketEventId = event?.ticketEventId ?? null;
  const ticketingEnabled = event?.ticketingEnabled ?? false;

  const ticketStats = useMemo(() => {
    if (!ticketingEnabled || !ticketEventId) return null;
    const info = getEventTicketInfo(ticketEventId);
    const codes = getEventScanCodes(ticketEventId);
    if (!info) return null;
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
  }, [ticketingEnabled, ticketEventId]);

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
  const hasTicketing = event.ticketingEnabled && !!event.ticketEventId;
  const showTicketStats = hasTicketing && activeTab === "tickets" && ticketStats;

  return (
    <div className="dash-page space-y-5">
      <div className="flex flex-wrap items-center gap-3">
        <PageHeader title={event.title} />
        <StatusBadge status={event.status} />
      </div>

      <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-muted-foreground">
        <span>{event.institution}</span>
        <span>{event.location}</span>
        <span>{event.date}</span>
        {event.eventTime && <span>{event.eventTime}</span>}
      </div>

      {/* Stat cards — swap based on active tab */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {showTicketStats ? (
          <>
            <StatCard
              label="Tickets Sold"
              value={ticketStats.sold}
              sub="across all types"
              icon={Ticket}
            />
            <StatCard
              label="Ticket Revenue"
              value={ticketStats.revenue}
              sub="gross revenue"
              icon={Coins}
              variant="success"
            />
            <StatCard
              label="Ticket Types"
              value={ticketStats.types}
              sub="available types"
              icon={Tag}
              variant="info"
            />
            <StatCard
              label="Total Scans"
              value={ticketStats.scans}
              sub="gate scan events"
              icon={ScanLine}
              variant="warning"
            />
          </>
        ) : (
          <>
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
          </>
        )}
      </div>

      {hasTicketing ? (
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="voting">Voting</TabsTrigger>
            <TabsTrigger value="tickets">Tickets</TabsTrigger>
          </TabsList>

          <TabsContent value="voting" className="mt-4">
            {event.categories.length > 0 ? (
              <CategoriesList categories={event.categories} />
            ) : (
              <p className="text-sm text-muted-foreground">No categories yet.</p>
            )}
          </TabsContent>

          <TabsContent value="tickets" className="mt-4">
            <EventTicketsSection eventId={event.ticketEventId!} readonly />
          </TabsContent>
        </Tabs>
      ) : (
        event.categories.length > 0 && (
          <CategoriesList categories={event.categories} />
        )
      )}
    </div>
  );
}
