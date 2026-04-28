import type { Metadata } from "next";
import { AdminAnalytics } from "@/components/features/dashboard/admin/analytics/admin-analytics";

export const metadata: Metadata = { title: "Analytics | AIMS Achievers Network" };

export default function AdminAnalyticsPage() {
  return <AdminAnalytics />;
}
