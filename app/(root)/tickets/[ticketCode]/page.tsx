"use client";

import { use } from "react";
import { lookupByCode } from "@/components/features/tickets/mock-data";
import TicketCard from "@/components/features/tickets/ticket-card";
import FeatureNavigationWrapper from "@/components/shared/feature-navigation-wrapper";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Ticket } from "lucide-react";
import Link from "next/link";

interface Props {
  params: Promise<{ ticketCode: string }>;
}

export default function TicketDetailPage({ params }: Props) {
  const { ticketCode } = use(params);
  const ticket = lookupByCode(ticketCode);

  if (!ticket) {
    return (
      <div id="ticket-detail" className="feature">
        <FeatureNavigationWrapper>
          <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <Ticket className="h-8 w-8 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-bold">Ticket Not Found</h2>
            <p className="text-sm text-muted-foreground max-w-sm">
              No ticket was found with the code &quot;{ticketCode}&quot;.
              Please check the code and try again.
            </p>
            <Button asChild variant="outline">
              <Link href="/tickets" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Ticket Lookup
              </Link>
            </Button>
          </div>
        </FeatureNavigationWrapper>
      </div>
    );
  }

  return (
    <div id="ticket-detail" className="feature">
      <FeatureNavigationWrapper>
        <div className="max-w-md mx-auto space-y-6">
          {/* Back link */}
          <Button asChild variant="ghost" size="sm" className="gap-1">
            <Link href="/tickets">
              <ArrowLeft className="h-4 w-4" />
              Back to Tickets
            </Link>
          </Button>

          {/* Full ticket card with QR */}
          <TicketCard ticket={ticket} />

          {/* Instructions */}
          <div className="rounded-lg border border-border bg-card p-4 space-y-3">
            <h3 className="text-sm font-bold">How to use your ticket</h3>
            <ol className="space-y-2 text-sm text-muted-foreground">
              <li className="flex gap-2">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                  1
                </span>
                <span>Show the QR code above at the event entrance</span>
              </li>
              <li className="flex gap-2">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                  2
                </span>
                <span>The event staff will scan your QR code</span>
              </li>
              <li className="flex gap-2">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                  3
                </span>
                <span>Once verified, you are in! Enjoy the event</span>
              </li>
            </ol>
          </div>

          {/* Re-entry note */}
          <p className="text-xs text-muted-foreground text-center">
            Need to leave and come back? Ask event staff to generate a new QR code for re-entry.
            Your old code will be invalidated to prevent unauthorized use.
          </p>
        </div>
      </FeatureNavigationWrapper>
    </div>
  );
}
