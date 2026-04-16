import type { Metadata } from "next";
import { UserOverview } from "@/components/features/dashboard/user/overview/user-overview";

export const metadata: Metadata = { title: "Dashboard | AIMS Achievers Network" };

export default async function UserDashboardPage({ params }: { params: Promise<{ profileId: string }> }) {
  const { profileId } = await params;
  return <UserOverview base={`/user/${profileId}`} />;
}
