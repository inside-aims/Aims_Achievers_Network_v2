import type { Metadata } from "next";
import { AdminEventDetail } from "@/components/features/dashboard/admin/admin-event-detail";

export const metadata: Metadata = { title: "Event Detail | AIMS Achievers Network" };

interface Props {
  params: Promise<{ uuid: string; eventId: string }>;
}

export default async function AdminEventDetailPage({ params }: Props) {
  const { uuid, eventId } = await params;
  return <AdminEventDetail base={`/admin/${uuid}`} eventId={eventId} />;
}
