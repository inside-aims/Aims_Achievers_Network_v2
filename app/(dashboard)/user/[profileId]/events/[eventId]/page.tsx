import type { Metadata } from "next";
import { EventDetail } from "@/components/features/dashboard/user/events/event-detail";

export const metadata: Metadata = { title: "Event | AIMS Achievers Network" };

export default async function EventDetailPage({ params }: { params: Promise<{ profileId: string; eventId: string }> }) {
  const { profileId, eventId } = await params;
  return <EventDetail base={`/user/${profileId}`} eventId={eventId} />;
}
