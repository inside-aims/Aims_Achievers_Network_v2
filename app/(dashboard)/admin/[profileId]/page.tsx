import type { Metadata } from "next";
import { AdminOverview } from "@/components/features/dashboard/admin/admin-overview";

export const metadata: Metadata = { title: "Admin Dashboard | AIMS Achievers Network" };

export default async function AdminDashboardPage({ params }: { params: Promise<{ profileId: string }> }) {
  const { profileId } = await params;
  return <AdminOverview base={`/admin/${profileId}`} />;
}
