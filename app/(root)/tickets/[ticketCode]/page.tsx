import { Metadata } from "next";
import TicketDetailView from "@/components/features/tickets/ticket-detail-view";

interface Props {
  params: Promise<{ ticketCode: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { ticketCode } = await params;
  return {
    title: `Ticket · ${ticketCode.toUpperCase()}`,
    description: "View your event ticket details and QR code.",
  };
}

export default async function TicketDetailPage({ params }: Props) {
  const { ticketCode } = await params;
  return <TicketDetailView ticketCode={ticketCode} />;
}
