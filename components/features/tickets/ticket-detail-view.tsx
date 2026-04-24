import { ArrowLeft, Ticket } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import FeatureNavigationWrapper from "@/components/shared/feature-navigation-wrapper";
import TicketCard from "./ticket-card";
import { Ticket as TicketType } from "./index";

interface TicketDetailViewProps {
  ticket: TicketType | null;
  ticketCode: string;
}

const TicketDetailView = ({ ticket, ticketCode }: TicketDetailViewProps) => {
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
          <Button asChild variant="ghost" size="sm" className="gap-1">
            <Link href="/tickets">
              <ArrowLeft className="h-4 w-4" />
              Back to Tickets
            </Link>
          </Button>

          <TicketCard ticket={ticket} />

          <div className="rounded-lg border border-border bg-card p-4 space-y-3">
            <h3 className="text-sm font-bold">How to use your ticket</h3>
            <ol className="space-y-2 text-sm text-muted-foreground">
              {[
                "Show the QR code above at the event entrance",
                "The event staff will scan your QR code",
                "Once verified, you are in! Enjoy the event",
              ].map((step, i) => (
                <li key={i} className="flex gap-2">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                    {i + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>

          <p className="text-xs text-muted-foreground text-center">
            Need to leave and come back? Ask event staff to generate a new QR code for re-entry.
            Your old code will be invalidated to prevent unauthorized use.
          </p>
        </div>
      </FeatureNavigationWrapper>
    </div>
  );
};

export default TicketDetailView;
