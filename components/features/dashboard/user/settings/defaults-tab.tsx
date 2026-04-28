"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { CURRENCIES, DEFAULT_EVENT_SETTINGS } from "./settings.data"
import { Field, SaveBar, SectionCard } from "./settings-primitives"

export function DefaultsTab() {
  const [currency,  setCurrency]  = useState(DEFAULT_EVENT_SETTINGS.currency)
  const [priceVote, setPriceVote] = useState(DEFAULT_EVENT_SETTINGS.priceVote)
  const [saved,     setSaved]     = useState(false)

  const dirty =
    currency  !== DEFAULT_EVENT_SETTINGS.currency ||
    priceVote !== DEFAULT_EVENT_SETTINGS.priceVote

  function save() { setSaved(true); setTimeout(() => setSaved(false), 2500) }

  return (
    <SectionCard
      title="Event defaults"
      desc="Pre-filled values when you create a new event. Override them per event anytime."
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Default currency">
          <Select value={currency} onValueChange={setCurrency}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {CURRENCIES.map((c) => (
                <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Field label="Price per vote">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-medium pointer-events-none select-none">
              {currency}
            </span>
            <Input
              type="number"
              min="0.10"
              step="0.10"
              value={priceVote}
              onChange={(e) => setPriceVote(e.target.value)}
              className="pl-14"
            />
          </div>
        </Field>
      </div>

      <div className="mt-5 rounded-xl bg-muted/50 border px-4 py-3.5 text-sm text-muted-foreground">
        New events will start with{" "}
        <span className="font-semibold text-foreground">{currency} {priceVote}</span>{" "}
        per vote. You can change this on a per-event basis.
      </div>

      <SaveBar onSave={save} saved={saved} disabled={!dirty} />
    </SectionCard>
  )
}
