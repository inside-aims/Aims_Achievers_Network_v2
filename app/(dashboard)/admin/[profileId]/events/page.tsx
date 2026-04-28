import type { Metadata } from "next";
import { AdminEvents } from "@/components/features/dashboard/admin/events/admin-events";

export const metadata: Metadata = { title: "Events | AIMS Achievers Network" };

interface Props {
  params: Promise<{ profileId: string }>;
}

export default async function AdminEventsPage({ params }: Props) {
  const { profileId } = await params;
  return <AdminEvents base={`/admin/${profileId}`} />;
}
