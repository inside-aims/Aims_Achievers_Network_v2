import { Metadata } from "next";
import { lookupByCode } from "@/components/features/tickets/mock-data";
import TicketDetailView from "@/components/features/tickets/ticket-detail-view";

interface Props {
  params: Promise<{ ticketCode: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { ticketCode } = await params;
  const ticket = lookupByCode(ticketCode);
  return {
    title: ticket ? `Ticket · ${ticket.holderName}` : "Ticket Not Found",
    description: ticket
      ? `${ticket.ticketTypeName} ticket for ${ticket.eventTitle}`
      : "No ticket found for this code.",
  };
}

export default async function TicketDetailPage({ params }: Props) {
  const { ticketCode } = await params;
  const ticket = lookupByCode(ticketCode);
  return <TicketDetailView ticket={ticket} ticketCode={ticketCode} />;
}
