"use client"

import { useState, useEffect } from "react"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
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
  const profile       = useQuery(api.organizerProfiles.getCurrent)
  const updateProfile = useMutation(api.organizerProfiles.update)

  const [currency,  setCurrency]  = useState(DEFAULT_EVENT_SETTINGS.currency)
  const [priceVote, setPriceVote] = useState(DEFAULT_EVENT_SETTINGS.priceVote)
  const [saved,     setSaved]     = useState(false)
  const [saving,    setSaving]    = useState(false)

  useEffect(() => {
    if (profile) {
      setCurrency(profile.defaultCurrency ?? DEFAULT_EVENT_SETTINGS.currency)
      const pesewas = profile.defaultPriceVotePesewas
      setPriceVote(pesewas != null ? (pesewas / 100).toFixed(2) : DEFAULT_EVENT_SETTINGS.priceVote)
    }
  }, [profile])

  const dirty =
    profile !== undefined &&
    (
      currency  !== (profile?.defaultCurrency ?? DEFAULT_EVENT_SETTINGS.currency) ||
      priceVote !== (
        profile?.defaultPriceVotePesewas != null
          ? (profile.defaultPriceVotePesewas / 100).toFixed(2)
          : DEFAULT_EVENT_SETTINGS.priceVote
      )
    )

  async function save() {
    if (!dirty) return
    setSaving(true)
    try {
      await updateProfile({
        defaultCurrency: currency,
        defaultPriceVotePesewas: Math.round(parseFloat(priceVote) * 100),
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } finally {
      setSaving(false)
    }
  }

  if (profile === undefined) {
    return (
      <div className="rounded-2xl border bg-card overflow-hidden">
        <div className="px-6 py-4 border-b bg-muted/30">
          <Skeleton className="h-4 w-32 mb-1.5" />
          <Skeleton className="h-3 w-56" />
        </div>
        <div className="px-6 py-5 space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <Skeleton className="h-9 rounded-md" />
            <Skeleton className="h-9 rounded-md" />
          </div>
          <Skeleton className="h-14 rounded-xl" />
        </div>
      </div>
    )
  }

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

      <SaveBar onSave={save} saved={saved} disabled={!dirty || saving} />
    </SectionCard>
  )
}
