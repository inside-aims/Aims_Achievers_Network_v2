import type { Metadata } from "next";
import { AdminOrganizerDetail } from "@/components/features/dashboard/admin/organizers/admin-organizer-detail";

export const metadata: Metadata = { title: "Organizer Profile | AIMS Achievers Network" };

interface Props {
  params: Promise<{ uuid: string; orgId: string }>;
}

export default async function AdminOrganizerDetailPage({ params }: Props) {
  const { uuid, orgId } = await params;
  return <AdminOrganizerDetail base={`/admin/${uuid}`} orgId={orgId} />;
}
