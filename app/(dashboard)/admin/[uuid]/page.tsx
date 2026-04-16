import type { Metadata } from "next";
import { AdminOverview } from "@/components/features/dashboard/admin/admin-overview";

export const metadata: Metadata = { title: "Admin Dashboard | AIMS Achievers Network" };

export default async function AdminDashboardPage({ params }: { params: Promise<{ uuid: string }> }) {
  const { uuid } = await params;
  return <AdminOverview base={`/admin/${uuid}`} />;
}
