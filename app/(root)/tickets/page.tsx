import { Metadata } from "next";
import TicketsView from "@/components/features/tickets/tickets-view";

export const metadata: Metadata = {
  title: "Tickets",
  description:
    "Find and view your event tickets. Look up by email, phone number, or ticket code to access your QR code for entry.",
};

export default function TicketsPage() {
  return <TicketsView />;
}
