import type { Metadata } from "next";
import { AdminOrganizers } from "@/components/features/dashboard/admin/organizers/admin-organizers";

export const metadata: Metadata = { title: "Organizers | AIMS Achievers Network" };

interface Props {
  params: Promise<{ profileId: string }>;
}

export default async function AdminOrganizersPage({ params }: Props) {
  const { profileId } = await params;
  return <AdminOrganizers base={`/admin/${profileId}`} />;
}
