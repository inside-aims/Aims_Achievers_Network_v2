"use client"

import { type Control } from "react-hook-form"
import { Input } from "@/components/ui/input"
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form"
import { type NewEventFormValues } from "./new-event-schema"

interface Props {
  control: Control<NewEventFormValues>
}

export function EventScheduleSection({ control }: Props) {
  return (
    <div className="form-section">
      <div>
        <h2 className="form-section-title">Location & Schedule</h2>
        <p className="form-section-desc">Where and when the event takes place.</p>
      </div>

      <FormField
        control={control}
        name="location"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Venue / Location <span className="text-destructive">*</span>
            </FormLabel>
            <FormControl>
              <Input placeholder="e.g. KTU Main Auditorium, Koforidua" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="eventDate"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Event Date <span className="text-destructive">*</span>
            </FormLabel>
            <FormControl>
              <Input type="date" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="form-grid-2">
        <FormField
          control={control}
          name="votingOpens"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Voting Opens <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="votingCloses"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Voting Closes <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

    </div>
  )
}
