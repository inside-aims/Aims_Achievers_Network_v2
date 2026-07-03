"use client"

import { useForm, useWatch, type Resolver } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { useMutation } from "convex/react"
import { ConvexError } from "convex/values"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { cn, withDefaults } from "@/lib/utils"
import { PageHeader } from "@/components/features/dashboard/shared/page-header"
import { draftToTicketTypePayload } from "@/components/features/tickets/ticket-type-editor"
import { EventFormatSection } from "./event-format-section"
import { EventBasicsSection } from "./event-basics-section"
import { EventScheduleSection } from "./event-schedule-section"
import { EventCoverSection } from "./event-cover-section"
import { VotingSetupSection } from "./voting-setup-section"
import { EventSettingsSection } from "./event-settings-section"
import { EventTicketingSection } from "./event-ticketing-section"
import { CategoriesSection } from "./categories-section"
import { EventContentDetailsSection } from "./event-content-details-section"
import {
  newEventSchema,
  NEW_EVENT_DEFAULTS,
  type NewEventFormValues,
} from "./new-event-schema"

interface Props {
  base:           string
  // When provided the form runs in edit mode: fields are pre-filled and
  // the submit button reads "Update Event" instead of "Create Event"
  initialValues?: Partial<NewEventFormValues>
  eventId?:       string
  initialBannerUrl?: string
}

export function NewEventForm({ base, initialValues, eventId, initialBannerUrl }: Props) {
  const isEdit = Boolean(eventId)
  const router = useRouter()

  const createWithCategories     = useMutation(api.events.createWithCategories)
  const updateDetails            = useMutation(api.events.updateDetails)
  const updateVotingConfig       = useMutation(api.events.updateVotingConfig)
  const updateLiveSettings       = useMutation(api.events.updateLiveSettings)
  const updateEventContentDetails = useMutation(api.events.updateEventContentDetails)

  // z.coerce.number() in zod v4 widens the input type to unknown which
  // conflicts with react-hook-form's Resolver generic. The cast is safe
  // because the runtime behaviour and output type are correct.
  const form = useForm<NewEventFormValues>({
    resolver: zodResolver(newEventSchema) as unknown as Resolver<NewEventFormValues>,
    defaultValues: initialValues
      ? withDefaults({ ...NEW_EVENT_DEFAULTS, isEditMode: isEdit }, initialValues)
      : NEW_EVENT_DEFAULTS,
  })

  const { formState: { isSubmitting, errors } } = form
  const eventFormat = useWatch({ control: form.control, name: "eventFormat" })

  async function onSubmit(values: NewEventFormValues) {
    const toMs = (dateStr: string) =>
      dateStr ? new Date(dateStr).getTime() : undefined

    // eventDate carries a time-of-day too, unlike the date-only voting fields.
    const eventDateMs = values.eventDate
      ? new Date(`${values.eventDate}T${values.eventTime || "00:00"}`).getTime()
      : undefined

    const isTicketOnly = values.eventFormat === "ticket-only"

    try {
      if (isEdit && eventId) {
        const id = eventId as Id<"events">

        await updateDetails({
          eventId:         id,
          title:           values.title,
          description:     values.description,
          institution:     values.institution || undefined,
          eventType:       values.eventType    || undefined,
          currency:        values.currency     || undefined,
          bannerStorageId: values.bannerStorageId || undefined,
          location:        values.location,
          eventDate:       eventDateMs,
          votingStartsAt:  isTicketOnly ? eventDateMs : toMs(values.votingOpens),
          votingEndsAt:    isTicketOnly ? eventDateMs : toMs(values.votingCloses),
        })

        if (!isTicketOnly) {
          await updateVotingConfig({
            eventId:             id,
            votingMode:          "standard",
            pricePerVotePesewas: Math.round(values.pricePerVote * 100),
          })
        }

        await updateLiveSettings({
          eventId:                id,
          showVotes:              isTicketOnly ? undefined : values.showVotes              === "yes",
          votingOpen:             isTicketOnly ? undefined : values.votingOpenByDefault    === "yes",
          publicPageVisible:      values.publicPage === "yes",
          nominationsOpen:        isTicketOnly ? undefined : values.nominationsEnabled     === "yes",
          nominationAutoApprove:  isTicketOnly ? undefined : values.autoPublishNominations === "yes",
        })

        // Event Details only applies to ticket-only events (see the note
        // above EventContentDetailsSection) — skip for awards events.
        if (isTicketOnly) {
          await updateEventContentDetails({
            eventId:        id,
            agenda:         values.agenda,
            lineup:         values.lineup,
            dressCode:      values.dressCode || undefined,
            ageRestriction: values.ageRestriction || undefined,
            venueNotes:     values.venueNotes || undefined,
            refundPolicy:   values.refundPolicy || undefined,
            termsNote:      values.termsNote || undefined,
            contactEmail:   values.contactEmail || undefined,
            contactPhone:   values.contactPhone || undefined,
            socialLinks:    values.socialLinks,
            faqs:           values.faqs,
            sponsors:       values.sponsors,
          })
        }

        toast.success("Event updated!", { description: "Your changes have been saved." })
        router.push(`${base}/events/${eventId}`)
        return
      }

      const ticketingActive = isTicketOnly || values.ticketingEnabled === "yes"

      const newEventId = await createWithCategories({
        title:               values.title,
        description:         values.description,
        institution:         values.institution     || undefined,
        eventType:           values.eventType       || undefined,
        currency:            values.currency        || "GHS",
        bannerStorageId:     values.bannerStorageId || undefined,
        location:            values.location,
        eventDate:           eventDateMs,
        // Public pages read the event's displayed date range from
        // votingStartsAt/votingEndsAt (used as the general "event window"
        // for display, not just voting) — mirrors the ticket-focus seed
        // data convention (see convex/seed.ts) so "days left"/"closes"
        // displays have a real date instead of showing nothing.
        votingStartsAt:      isTicketOnly ? eventDateMs : toMs(values.votingOpens),
        votingEndsAt:        isTicketOnly ? eventDateMs : toMs(values.votingCloses),
        votingMode:          "standard",
        // price is in GHS on the form; store as pesewas (× 100).
        // Ticket-only events carry no categories/nominees and never open
        // voting, so this field is structurally unused — 0 is an inert
        // sentinel, not a live pricing value.
        pricePerVotePesewas: isTicketOnly ? 0 : Math.round(values.pricePerVote * 100),
        showVotes:              isTicketOnly ? false : values.showVotes              === "yes",
        votingOpen:             isTicketOnly ? false : values.votingOpenByDefault    === "yes",
        publicPageVisible:      values.publicPage === "yes",
        nominationsOpen:        isTicketOnly ? false : values.nominationsEnabled     === "yes",
        nominationAutoApprove:  isTicketOnly ? false : values.autoPublishNominations === "yes",
        categories: isTicketOnly ? [] : values.categories.map((c) => ({
          name:        c.name,
          description: c.description || undefined,
        })),
        ticketingEnabled: ticketingActive,
        themeId:          ticketingActive ? values.themeId : undefined,
        ticketTypes:      ticketingActive ? values.ticketTypes.map(draftToTicketTypePayload) : undefined,
        // Event Details only applies to ticket-only events (see the note
        // above EventContentDetailsSection) — omit for awards events.
        agenda:         isTicketOnly ? values.agenda : undefined,
        lineup:         isTicketOnly ? values.lineup : undefined,
        dressCode:      isTicketOnly ? values.dressCode || undefined : undefined,
        ageRestriction: isTicketOnly ? values.ageRestriction || undefined : undefined,
        venueNotes:     isTicketOnly ? values.venueNotes || undefined : undefined,
        refundPolicy:   isTicketOnly ? values.refundPolicy || undefined : undefined,
        termsNote:      isTicketOnly ? values.termsNote || undefined : undefined,
        contactEmail:   isTicketOnly ? values.contactEmail || undefined : undefined,
        contactPhone:   isTicketOnly ? values.contactPhone || undefined : undefined,
        socialLinks:    isTicketOnly ? values.socialLinks : undefined,
        faqs:           isTicketOnly ? values.faqs : undefined,
        sponsors:       isTicketOnly ? values.sponsors : undefined,
      })

      toast.success("Event created!", {
        description: "Your event has been saved as a draft.",
      })
      router.push(`${base}/events/${newEventId}`)
    } catch (err) {
      const description = err instanceof ConvexError
        ? String(err.data)
        : "Something went wrong. Please try again."
      toast.error(isEdit ? "Failed to update event" : "Failed to create event", { description })
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader title={isEdit ? "Edit Event" : "New Event"} />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="space-y-5">
          {/* fieldset[disabled] propagates to all native + Radix form controls */}
          <fieldset
            disabled={isSubmitting}
            className={cn(
              "border-0 p-0 m-0 min-w-0 space-y-5",
              isSubmitting && "opacity-60",
            )}
          >
            {/* Event format choice — full width, above everything else */}
            <EventFormatSection control={form.control} locked={isEdit} />

            {/* Two-column layout on desktop, single column on mobile */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {/* Left column — primary content */}
              <div className="space-y-5">
                <EventBasicsSection  control={form.control} />
                <EventScheduleSection control={form.control} eventFormat={eventFormat} />
              </div>

              {/* Right column — media + config */}
              <div className="space-y-5">
                <EventCoverSection
                  onStorageId={(id) => form.setValue("bannerStorageId", id ?? undefined)}
                  initialImageUrl={initialBannerUrl}
                />
                {eventFormat === "awards" && <VotingSetupSection control={form.control} />}
                <EventSettingsSection control={form.control} eventFormat={eventFormat} />
                {!isEdit && (
                  <EventTicketingSection
                    control={form.control}
                    errors={errors}
                    forceEnabled={eventFormat === "ticket-only"}
                  />
                )}
              </div>
            </div>

            {/* Categories spans full width — awards format only, create mode only */}
            {eventFormat === "awards" && !isEdit && (
              <CategoriesSection control={form.control} errors={errors} />
            )}

            {isEdit && (
              <p className="text-xs text-muted-foreground rounded-lg border border-dashed border-border p-3">
                Categories and ticket types are managed from the event page, not here.
              </p>
            )}

            {/* Event Details only applies to ticket-only events — it's the
                content shown on the public "Event Details" toggle, which
                only ever renders for ticket-only events. */}
            {eventFormat === "ticket-only" && (
              <EventContentDetailsSection control={form.control} />
            )}
          </fieldset>

          {/* Actions — outside fieldset so Cancel always works */}
          <div className="flex items-center justify-end gap-3 pt-1">
            {(isEdit && eventId) && (
                <Button variant="outline" type="button" asChild disabled={isSubmitting}>
                  <Link href={`${base}/events/${eventId}`}>
                    Cancel
                  </Link>
                </Button>
            )}
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="size-4 mr-2 animate-spin" />}
              {isEdit ? "Update Event" : "Create Event"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
