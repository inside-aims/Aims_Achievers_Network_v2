import type { Metadata } from "next"
import { UserHighlights } from "@/components/features/dashboard/user/highlight/user-highlights"

export const metadata: Metadata = { title: "Highlights | AIMS Achievers Network" }

export default function HighlightsPage() {
  return <UserHighlights />
}
