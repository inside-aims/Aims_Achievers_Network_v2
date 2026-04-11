"use client"

import { type Control } from "react-hook-form"
import { Input } from "@/components/ui/input"
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
  FormDescription,
  FormMessage,
} from "@/components/ui/form"
import { CURRENCIES, type NewEventFormValues } from "./new-event-schema"

interface Props {
  control: Control<NewEventFormValues>
}

export function VotingSetupSection({ control }: Props) {
  return (
    <div className="form-section">
      <div>
        <h2 className="form-section-title">Voting Setup</h2>
        <p className="form-section-desc">Configure how voting and payments work for this event.</p>
      </div>

      <div className="form-grid-2">
        <FormField
          control={control}
          name="currency"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Currency <span className="text-destructive">*</span>
              </FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {CURRENCIES.map((c) => (
                    <SelectItem key={c.value} value={c.value}>
                      {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

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
    </div>
  )
}
