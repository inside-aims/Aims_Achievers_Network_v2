import type { Metadata } from "next"
import { EditEventLoader } from "@/components/features/dashboard/user/new-event/edit-event-loader"

export const metadata: Metadata = { title: "Edit Event | AIMS Achievers Network" }

export default async function EditEventPage({
  params,
}: {
  params: Promise<{ profileId: string; eventId: string }>
}) {
  const { profileId, eventId } = await params

  return <EditEventLoader base={`/user/${profileId}`} eventId={eventId} />
}
