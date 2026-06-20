"use client";

import { use, useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { ScanLine, Ticket, Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import ScanGate from "@/components/features/tickets/scan-gate";
import EventScanView from "@/components/features/tickets/event-scan-view";

interface Props {
  params: Promise<{ eventId: string }>;
}

export default function ScanPage({ params }: Props) {
  const { eventId: slug } = use(params);
  const eventInfo = useQuery(api.tickets.getEventTicketInfoBySlug, { slug });
  const [scanAccessCodeId, setScanAccessCodeId] = useState<Id<"scanAccessCodes"> | null>(null);

  if (eventInfo === undefined) {
    return (
      <div className="flex items-center justify-center min-h-[100dvh]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!eventInfo) {
    return (
      <div id="scan-not-found" className="feature">
        <div className="flex flex-col items-center justify-center py-20 gap-4 text-center max-w-sm mx-auto">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <ScanLine className="h-8 w-8 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-bold">Event Not Found</h2>
          <p className="text-sm text-muted-foreground">
            No event matches &quot;{slug}&quot;. Check the link or contact the event organizer.
          </p>
          <Button asChild variant="outline">
            <Link href="/events" className="gap-2">
              <Ticket className="h-4 w-4" />
              Browse Events
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  if (scanAccessCodeId) {
    return (
      <EventScanView
        eventId={eventInfo.eventId as Id<"events">}
        eventTitle={eventInfo.eventTitle}
        scanAccessCodeId={scanAccessCodeId}
      />
    );
  }

  return (
    <ScanGate
      eventId={eventInfo.eventId as Id<"events">}
      eventTitle={eventInfo.eventTitle}
      eventDate={eventInfo.eventDate}
      eventTime={eventInfo.eventTime}
      venue={eventInfo.venue}
      onUnlock={setScanAccessCodeId}
    />
  );
}
