"use client";

import { Ticket, Users, MapPin, Calendar, Clock, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EventTicketInfo, TicketType } from "./index";
import TicketTypeCard from "./ticket-type-card";
import Link from "next/link";

interface TicketPurchaseSectionProps {
  ticketInfo: EventTicketInfo;
  onSelectType: (ticketType: TicketType) => void;
}

const TicketPurchaseSection = ({ ticketInfo, onSelectType }: TicketPurchaseSectionProps) => {
  const totalAvailable = ticketInfo.ticketTypes.reduce((sum, t) => {
    if (t.quantityTotal === -1) return sum + 999;
    return sum + (t.quantityTotal - t.quantitySold);
  }, 0);

  const allSoldOut = ticketInfo.ticketTypes.every(
    (t) => t.quantityTotal !== -1 && t.quantitySold >= t.quantityTotal
  );

  return (
    <section id="tickets-section" className="space-y-3">
      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-border" />
        <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          <Ticket className="h-3.5 w-3.5" />
          Tickets
        </span>
        <div className="h-px flex-1 bg-border" />
      </div>

      <div className="rounded-xl border border-primary/15 bg-card overflow-hidden shadow-sm">
        <div className="bg-primary/5 border-b border-primary/10 px-4 md:px-6 py-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="text-base font-bold leading-tight truncate">
                {ticketInfo.eventTitle}
              </h3>
              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3 shrink-0" />
                  {ticketInfo.eventDate}
                </span>
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3 shrink-0" />
                  {ticketInfo.eventTime}
                </span>
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3 shrink-0" />
                  {ticketInfo.venue}
                </span>
              </div>
            </div>

            {allSoldOut ? (
              <Badge variant="secondary" className="shrink-0">Sold Out</Badge>
            ) : (
              <Badge className="bg-primary/10 text-primary border-primary/20 shrink-0 gap-1">
                <Users className="h-3 w-3" />
                {totalAvailable > 900 ? "Available" : `${totalAvailable} left`}
              </Badge>
            )}
          </div>
        </div>

        <div className="relative flex items-center">
          <div className="h-4 w-4 rounded-full bg-background border border-primary/15 -ml-2 z-10 shrink-0" />
          <div className="flex-1 border-t border-dashed border-primary/20" />
          <div className="h-4 w-4 rounded-full bg-background border border-primary/15 -mr-2 z-10 shrink-0" />
        </div>

        <div className="px-4 md:px-6 py-4 space-y-3">
          {ticketInfo.ticketTypes.map((ticketType) => (
            <TicketTypeCard
              key={ticketType.id}
              ticketType={ticketType}
              onSelect={() => onSelectType(ticketType)}
            />
          ))}
        </div>

        <div className="border-t border-dashed border-primary/10 px-4 md:px-6 py-3 bg-muted/30">
          <p className="text-xs text-muted-foreground text-center">
            Your ticket and QR code will be sent to your email after purchase
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between rounded-lg border border-border bg-card px-4 py-3 gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium">Already have a ticket?</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Find it using your email, phone, or ticket code
          </p>
        </div>
        <Button variant="outline" size="sm" asChild className="shrink-0 gap-1.5">
          <Link href="/tickets">
            Find Ticket
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </Button>
      </div>
    </section>
  );
};

export default TicketPurchaseSection;
