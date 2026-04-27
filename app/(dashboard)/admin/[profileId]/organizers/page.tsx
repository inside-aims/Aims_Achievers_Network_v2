import type { Metadata } from "next";
import { AdminOrganizers } from "@/components/features/dashboard/admin/organizers/admin-organizers";

export const metadata: Metadata = { title: "Organizers | AIMS Achievers Network" };

interface Props {
  params: Promise<{ uuid: string }>;
}

export default async function AdminOrganizersPage({ params }: Props) {
  const { uuid } = await params;
  return <AdminOrganizers base={`/admin/${uuid}`} />;
}
