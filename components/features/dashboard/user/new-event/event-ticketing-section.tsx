"use client"

import { useWatch, type Control, type FieldErrors } from "react-hook-form"
import { Ticket } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form"
import { Label } from "@/components/ui/label"
import { TicketThemeSelect } from "@/components/features/tickets/ticket-theme-select"
import { TicketTypeEditor } from "@/components/features/tickets/ticket-type-editor"
import { type NewEventFormValues } from "./new-event-schema"

interface Props {
  control: Control<NewEventFormValues>
  errors:  FieldErrors<NewEventFormValues>
  /** True for ticket-only events — ticketing can't be turned off, so the
   *  yes/no toggle is hidden and types + theme always show. */
  forceEnabled?: boolean
}

export function EventTicketingSection({ control, errors, forceEnabled = false }: Props) {
  const ticketingEnabledField = useWatch({ control, name: "ticketingEnabled" })
  const active = forceEnabled || ticketingEnabledField === "yes"

  const arrayError =
    typeof (errors.ticketTypes as { message?: string })?.message === "string"
      ? (errors.ticketTypes as { message?: string }).message
      : null

  return (
    <div className="form-section">
      <div>
        <h2 className="form-section-title">Ticketing</h2>
        <p className="form-section-desc">Sell entry tickets and track attendance with QR codes.</p>
      </div>

      {/* Enable toggle — hidden for ticket-only events, which are always ticketed */}
      {!forceEnabled && (
        <FormField
          control={control}
          name="ticketingEnabled"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border border-border p-3 gap-4 space-y-0">
              <div className="flex items-start gap-3 min-w-0">
                <div className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-md bg-primary/10">
                  <Ticket className="size-3.5 text-primary" />
                </div>
                <div className="min-w-0 space-y-0.5">
                  <p className="text-sm font-medium leading-none">Enable E-Tickets</p>
                  <p className="text-xs text-muted-foreground">
                    Sell tickets for this event and verify attendance via QR codes.
                  </p>
                </div>
              </div>
              <div className="shrink-0">
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-[4.5rem]">
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      )}

      {active && (
        <>
          <div className="space-y-1.5">
            <Label>Ticket Theme</Label>
            <FormField
              control={control}
              name="themeId"
              render={({ field }) => (
                <TicketThemeSelect value={field.value} onChange={field.onChange} />
              )}
            />
          </div>

          <FormField
            control={control}
            name="ticketTypes"
            render={({ field }) => (
              <TicketTypeEditor
                value={field.value}
                onChange={field.onChange}
                minRows={0}
                arrayError={arrayError}
              />
            )}
          />
        </>
      )}
    </div>
  )
}
