"use client"

import { type Control } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
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
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form"
import { EVENT_TYPES, type NewEventFormValues } from "./new-event-schema"

interface Props {
  control: Control<NewEventFormValues>
}

export function EventBasicsSection({ control }: Props) {
  return (
    <div className="form-section">
      <div>
        <h2 className="form-section-title">Event Details</h2>
        <p className="form-section-desc">Basic information about your event.</p>
      </div>

      <div className="form-grid-2">
        <FormField
          control={control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Event Title <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g. FAST Excellence Awards 2025"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="eventType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Event Type <span className="text-destructive">*</span>
              </FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select event type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {EVENT_TYPES.map((t) => (
                    <SelectItem key={t.value} value={t.value}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={control}
        name="institution"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Institution / Organisation <span className="text-destructive">*</span>
            </FormLabel>
            <FormControl>
              <Input
                placeholder="e.g. Koforidua Technical University"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Description <span className="text-destructive">*</span>
            </FormLabel>
            <FormControl>
              <Textarea
                placeholder="Describe the purpose and theme of the event..."
                className="resize-none"
                rows={4}
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}
