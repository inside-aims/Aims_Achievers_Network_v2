"use client"

import { useForm, type Resolver } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { cn } from "@/lib/utils"
import { PageHeader } from "@/components/features/dashboard/shared/page-header"
import { EventBasicsSection } from "./event-basics-section"
import { EventScheduleSection } from "./event-schedule-section"
import { EventCoverSection } from "./event-cover-section"
import { VotingSetupSection } from "./voting-setup-section"
import { EventSettingsSection } from "./event-settings-section"
import { CategoriesSection } from "./categories-section"
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
}

export function NewEventForm({ base, initialValues, eventId }: Props) {
  const isEdit = Boolean(eventId)
  const router = useRouter()

  // z.coerce.number() in zod v4 widens the input type to unknown which
  // conflicts with react-hook-form's Resolver generic. The cast is safe
  // because the runtime behaviour and output type are correct.
  const form = useForm<NewEventFormValues>({
    resolver: zodResolver(newEventSchema) as unknown as Resolver<NewEventFormValues>,
    defaultValues: initialValues
      ? { ...NEW_EVENT_DEFAULTS, ...initialValues }
      : NEW_EVENT_DEFAULTS,
  })

  const { formState: { isSubmitting, errors } } = form

  async function onSubmit(values: NewEventFormValues) {
    try {
      // TODO: replace with Convex mutation when DB is wired up
      console.log(`[NewEventForm] ${isEdit ? "update" : "create"}:`, values)
      toast.success(isEdit ? "Event updated!" : "Event created!", {
        description: isEdit
          ? "Your changes have been saved."
          : "Your event has been saved as a draft.",
      })
      if (isEdit && eventId) {
        router.push(`${base}/events/${eventId}`)
      }
    } catch {
      toast.error(isEdit ? "Failed to update event" : "Failed to create event", {
        description: "Something went wrong. Please try again.",
      })
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
            {/* Two-column layout on desktop, single column on mobile */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {/* Left column — primary content */}
              <div className="space-y-5">
                <EventBasicsSection  control={form.control} />
                <EventScheduleSection control={form.control} />
              </div>

              {/* Right column — media + config */}
              <div className="space-y-5">
                <EventCoverSection />
                <VotingSetupSection  control={form.control} />
                <EventSettingsSection control={form.control} />
              </div>
            </div>

            {/* Categories spans full width */}
            <CategoriesSection control={form.control} errors={errors} />
          </fieldset>

          {/* Actions — outside fieldset so Cancel always works */}
          <div className="flex items-center justify-end gap-3 pt-1">
            <Button variant="outline" type="button" asChild disabled={isSubmitting}>
              <Link href={`${base}/events`}>Cancel</Link>
            </Button>
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
