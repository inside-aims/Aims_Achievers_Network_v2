import type { Metadata } from "next";
import { AdminEventDetail } from "@/components/features/dashboard/admin/events/admin-event-detail";

export const metadata: Metadata = { title: "Event Detail | AIMS Achievers Network" };

interface Props {
  params: Promise<{ profileId: string; eventId: string }>;
}

export default async function AdminEventDetailPage({ params }: Props) {
  const { profileId, eventId } = await params;
  return <AdminEventDetail base={`/admin/${profileId}`} eventId={eventId} />;
}
