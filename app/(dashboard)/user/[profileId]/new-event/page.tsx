import type { Metadata } from "next"
import { NewEventForm } from "@/components/features/dashboard/user/new-event/new-event-form"

export const metadata: Metadata = { title: "New Event | AIMS Achievers Network" }

export default async function NewEventPage({
  params,
}: {
  params: Promise<{ profileId: string }>
}) {
  const { profileId } = await params
  return <NewEventForm base={`/user/${profileId}`} />
}
