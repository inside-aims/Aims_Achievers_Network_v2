import type { Metadata } from "next"
import { UserAnalytics } from "@/components/features/dashboard/user/analytics/user-analytics"

export const metadata: Metadata = { title: "Analytics | AIMS Achievers Network" }

export default function UserAnalyticsPage() {
  return <UserAnalytics />
}
