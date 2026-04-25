"use client"

import { useState } from "react"
import { Info } from "lucide-react"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Field, SaveBar, SectionCard } from "@/components/features/dashboard/user/settings/settings-primitives"
import { DUMMY_PAYOUT_CONFIG, PAYOUT_SCHEDULES } from "./admin-settings.data"

export function PayoutsTab() {
  const [minPayout,  setMinPayout]  = useState(DUMMY_PAYOUT_CONFIG.globalMinPayout)
  const [autoThresh, setAutoThresh] = useState(DUMMY_PAYOUT_CONFIG.autoApproveThreshold)
  const [schedule,   setSchedule]   = useState(DUMMY_PAYOUT_CONFIG.schedule)
  const [saved,      setSaved]      = useState(false)

  const dirty =
    minPayout  !== DUMMY_PAYOUT_CONFIG.globalMinPayout      ||
    autoThresh !== DUMMY_PAYOUT_CONFIG.autoApproveThreshold ||
    schedule   !== DUMMY_PAYOUT_CONFIG.schedule

  function save() { setSaved(true); setTimeout(() => setSaved(false), 2500) }

  return (
    <div className="space-y-5">
      <SectionCard
        title="Global payout rules"
        desc="These rules apply to all organizer payouts platform-wide."
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <Field
            label="Minimum payout (GHS)"
            hint="Organizers cannot request a payout below this amount."
          >
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-medium pointer-events-none select-none">
                GHS
              </span>
              <Input
                type="number"
                min="0"
                step="0.01"
                value={minPayout}
                onChange={(e) => setMinPayout(e.target.value)}
                className="pl-12"
              />
            </div>
          </Field>

          <Field
            label="Auto-approve threshold (GHS)"
            hint="Payouts at or below this amount are approved automatically."
          >
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-medium pointer-events-none select-none">
                GHS
              </span>
              <Input
                type="number"
                min="0"
                step="0.01"
                value={autoThresh}
                onChange={(e) => setAutoThresh(e.target.value)}
                className="pl-12"
              />
            </div>
          </Field>

          <Field label="Payout schedule" hint="When payouts are batched and processed.">
            <Select value={schedule} onValueChange={setSchedule}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {PAYOUT_SCHEDULES.map((s) => (
                  <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        </div>

        <div className="mt-4 flex items-start gap-2 rounded-xl bg-muted/50 border px-4 py-3 text-xs text-muted-foreground">
          <Info className="size-3.5 shrink-0 mt-0.5" />
          <span>
            Payouts above{" "}
            <span className="font-semibold text-foreground">GHS {autoThresh}</span> require
            manual admin approval. Below that, they are processed automatically on the{" "}
            <span className="font-semibold text-foreground capitalize">
              {PAYOUT_SCHEDULES.find((s) => s.value === schedule)?.label ?? schedule}
            </span>{" "}
            schedule.
          </span>
        </div>

        <SaveBar onSave={save} saved={saved} disabled={!dirty} />
      </SectionCard>
    </div>
  )
}
