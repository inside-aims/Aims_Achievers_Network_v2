"use client";

import { use, useState } from "react";
import { ScanLine, Ticket } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getEventTicketInfo } from "@/components/features/tickets/mock-data";
import ScanGate from "@/components/features/tickets/scan-gate";
import EventScanView from "@/components/features/tickets/event-scan-view";

interface Props {
  params: Promise<{ eventId: string }>;
}

type ScanMode = "gate" | "scanning";

export default function ScanPage({ params }: Props) {
  const { eventId } = use(params);
  const eventInfo = getEventTicketInfo(eventId);
  const [mode, setMode] = useState<ScanMode>("gate");

  if (!eventInfo) {
    return (
      <div id="scan-not-found" className="feature">
        <div className="flex flex-col items-center justify-center py-20 gap-4 text-center max-w-sm mx-auto">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <ScanLine className="h-8 w-8 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-bold">Event Not Found</h2>
          <p className="text-sm text-muted-foreground">
            No event matches &quot;{eventId}&quot;. Check the link or contact the event organizer.
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

  if (mode === "scanning") {
    return (
      <EventScanView
        eventId={eventInfo.eventId}
        eventTitle={eventInfo.eventTitle}
      />
    );
  }

  return (
    <ScanGate
      eventId={eventInfo.eventId}
      eventTitle={eventInfo.eventTitle}
      eventDate={eventInfo.eventDate}
      eventTime={eventInfo.eventTime}
      venue={eventInfo.venue}
      onUnlock={() => setMode("scanning")}
    />
  );
}
