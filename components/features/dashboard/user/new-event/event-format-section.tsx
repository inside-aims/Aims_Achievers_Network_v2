"use client"

import { type Control, useController } from "react-hook-form"
import { Award, Ticket } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { cn } from "@/lib/utils"
import { EVENT_FORMATS, type NewEventFormValues, type EventFormat } from "./new-event-schema"

interface Props {
  control: Control<NewEventFormValues>
  locked?: boolean
}

const ICONS: Record<EventFormat, typeof Award> = {
  awards:      Award,
  "ticket-only": Ticket,
}

export function EventFormatSection({ control, locked = false }: Props) {
  const { field } = useController({ control, name: "eventFormat" })

  if (locked) {
    const format = EVENT_FORMATS.find((f) => f.value === field.value) ?? EVENT_FORMATS[0]
    const Icon = ICONS[format.value]
    return (
      <div className="form-section">
        <div>
          <h2 className="form-section-title">Event Format</h2>
          <p className="form-section-desc">Can&apos;t be changed after creation.</p>
        </div>
        <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/30 p-4">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary/10">
            <Icon className="size-4 text-primary" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold leading-none">{format.label}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{format.description}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="form-section">
      <div>
        <h2 className="form-section-title">Event Format</h2>
        <p className="form-section-desc">Choose what kind of event this is.</p>
      </div>

      <RadioGroup
        value={field.value}
        onValueChange={field.onChange}
        className="grid grid-cols-1 sm:grid-cols-2 gap-3"
      >
        {EVENT_FORMATS.map((format) => {
          const Icon = ICONS[format.value]
          const selected = field.value === format.value

          return (
            <label
              key={format.value}
              htmlFor={`format-${format.value}`}
              className={cn(
                "flex items-start gap-3 rounded-lg border p-4 cursor-pointer transition-colors",
                selected
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/40 hover:bg-primary/5",
              )}
            >
              <RadioGroupItem
                value={format.value}
                id={`format-${format.value}`}
                className="mt-0.5"
              />
              <div className="flex items-start gap-3 min-w-0">
                <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-md bg-primary/10">
                  <Icon className="size-4 text-primary" />
                </div>
                <div className="min-w-0 space-y-0.5">
                  <p className="text-sm font-semibold leading-none">{format.label}</p>
                  <p className="text-xs text-muted-foreground">{format.description}</p>
                </div>
              </div>
            </label>
          )
        })}
      </RadioGroup>
    </div>
  )
}
