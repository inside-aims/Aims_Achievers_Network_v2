"use client"

import Link from "next/link"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { Skeleton } from "@/components/ui/skeleton"
import { NewEventForm } from "./new-event-form"
import type { NewEventFormValues } from "./new-event-schema"

interface Props {
  base:    string
  eventId: string
}

export function EditEventLoader({ base, eventId }: Props) {
  const convexId = eventId as Id<"events">
  const event = useQuery(api.events.getByIdForOrganizer, { eventId: convexId })
  const stats = useQuery(api.dashboard.eventStats, { eventId: convexId })

  if (event === undefined || stats === undefined) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  if (event === null || stats === null) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-2 text-center">
        <p className="font-semibold text-lg">Event not found</p>
        <Link href={`${base}/events`} className="text-sm text-primary hover:underline">
          Back to events
        </Link>
      </div>
    )
  }

  const isTicketOnly = (event.ticketingEnabled ?? false) && stats.categoriesCount === 0
  const toDateInput = (ms?: number) => (ms ? new Date(ms).toISOString().split("T")[0] : "")
  const toTimeInput  = (ms?: number) => (ms ? new Date(ms).toISOString().split("T")[1].slice(0, 5) : "")

  const initialValues: Partial<NewEventFormValues> = {
    eventFormat:  isTicketOnly ? "ticket-only" : "awards",
    title:        event.title,
    description:  event.description ?? "",
    eventType:    event.eventType ?? "",
    institution:  event.institution ?? "",
    currency:     event.currency ?? "GHS",
    location:     event.location ?? "",
    eventDate:    toDateInput(event.eventDate),
    eventTime:    toTimeInput(event.eventDate),
    votingOpens:  toDateInput(event.votingStartsAt),
    votingCloses: toDateInput(event.votingEndsAt),
    pricePerVote: event.pricePerVotePesewas / 100,
    showVotes:              event.showVotes ? "yes" : "no",
    publicPage:             event.publicPageVisible ? "yes" : "no",
    votingOpenByDefault:    event.votingOpen ? "yes" : "no",
    nominationsEnabled:     event.nominationsOpen ? "yes" : "no",
    autoPublishNominations: event.nominationAutoApprove ? "yes" : "no",
    ticketingEnabled: event.ticketingEnabled ? "yes" : "no",
    themeId:          event.themeId ?? "royal-night",
    agenda:         event.agenda,
    lineup:         event.lineup,
    dressCode:      event.dressCode,
    ageRestriction: event.ageRestriction,
    venueNotes:     event.venueNotes,
    refundPolicy:   event.refundPolicy,
    termsNote:      event.termsNote,
    contactEmail:   event.contactEmail,
    contactPhone:   event.contactPhone,
    socialLinks:    event.socialLinks,
    faqs:           event.faqs,
    sponsors:       event.sponsors,
  }

  return (
    <NewEventForm
      base={base}
      eventId={eventId}
      initialValues={initialValues}
      initialBannerUrl={event.bannerUrl}
    />
  )
}
