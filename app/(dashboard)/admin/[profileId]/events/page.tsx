import type { Metadata } from "next";
import { AdminEvents } from "@/components/features/dashboard/admin/events/admin-events";

export const metadata: Metadata = { title: "Events | AIMS Achievers Network" };

interface Props {
  params: Promise<{ uuid: string }>;
}

export default async function AdminEventsPage({ params }: Props) {
  const { uuid } = await params;
  return <AdminEvents base={`/admin/${uuid}`} />;
}
