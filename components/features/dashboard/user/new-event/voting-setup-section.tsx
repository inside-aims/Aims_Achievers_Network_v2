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

export function VotingSetupSection({ control }: Props) {
  return (
    <div className="form-section">
      <div>
        <h2 className="form-section-title">Voting Setup</h2>
        <p className="form-section-desc">Configure how much a vote costs.</p>
      </div>

      <FormField
        control={control}
        name="pricePerVote"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Price per Vote <span className="text-destructive">*</span>
            </FormLabel>
            <FormControl>
              <Input
                type="number"
                min={0.01}
                step={0.01}
                placeholder="1.00"
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
