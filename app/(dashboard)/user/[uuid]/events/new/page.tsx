import type { Metadata } from "next"
import { ComingSoon } from "@/components/features/dashboard/shared/coming-soon"

export const metadata: Metadata = { title: "New Event | AIMS Achievers Network" }

export default function NewEventPage() {
  return <ComingSoon title="Create New Event" />
}
