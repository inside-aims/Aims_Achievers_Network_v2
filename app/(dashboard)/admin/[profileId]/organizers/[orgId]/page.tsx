import type { Metadata } from "next";
import { AdminOrganizerDetail } from "@/components/features/dashboard/admin/organizers/admin-organizer-detail";

export const metadata: Metadata = { title: "Organizer Profile | AIMS Achievers Network" };

interface Props {
  params: Promise<{ profileId: string; orgId: string }>;
}

export default async function AdminOrganizerDetailPage({ params }: Props) {
  const { profileId, orgId } = await params;
  return <AdminOrganizerDetail base={`/admin/${profileId}`} orgId={orgId} />;
}
