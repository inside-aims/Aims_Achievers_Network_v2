import type { Metadata } from "next"
import { NewEventForm } from "@/components/features/dashboard/user/new-event/new-event-form"
import { MOCK_EVENT_DETAILS } from "@/components/features/dashboard/user/events/events"
import type { NewEventFormValues } from "@/components/features/dashboard/user/new-event/new-event-schema"

export const metadata: Metadata = { title: "Edit Event | AIMS Achievers Network" }

// Convert a human-readable date string to the YYYY-MM-DD format that
// <input type="date"> requires. Returns "" when the string cannot be parsed.
function toInputDate(dateStr: string): string {
  if (!dateStr) return ""
  try {
    const d = new Date(dateStr)
    return isNaN(d.getTime()) ? "" : d.toISOString().split("T")[0]
  } catch {
    return ""
  }
}

export default async function EditEventPage({
  params,
}: {
  params: Promise<{ uuid: string; eventId: string }>
}) {
  const { uuid, eventId } = await params
  const raw = MOCK_EVENT_DETAILS[eventId]

  // TODO: fetch from Convex when DB is wired up.
  const initialValues: Partial<NewEventFormValues> | undefined = raw
    ? {
        title:               raw.title,
        description:         raw.description,
        eventType:           "awards-night",
        institution:         raw.institution,
        location:            raw.location,
        eventDate:           toInputDate(raw.date),
        votingOpens:         toInputDate(raw.date),
        votingCloses:        toInputDate(raw.closesDate),
        currency:            raw.currency,
        pricePerVote:        raw.pricePerVote,
        showVotes:           raw.controls.showVotes ? "yes" : "no",
        publicPage:          raw.controls.publicPage ? "yes" : "no",
        votingOpenByDefault: raw.controls.votingOpen ? "yes" : "no",
        categories:          raw.categories.map((c) => ({
          name:        c.name,
          description: c.description,
        })),
      }
    : undefined

  return (
    <NewEventForm
      base={`/user/${uuid}`}
      initialValues={initialValues}
      eventId={eventId}
    />
  )
}
