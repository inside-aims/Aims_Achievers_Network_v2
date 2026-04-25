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
import { Field, SaveBar, SectionCard } from "@/components/features/dashboard/user/settings/settings-primitives"
import { DUMMY_PLATFORM, TIMEZONES } from "./admin-settings.data"

export function PlatformTab() {
  const [name,       setName]       = useState(DUMMY_PLATFORM.name)
  const [email,      setEmail]      = useState(DUMMY_PLATFORM.supportEmail)
  const [commission, setCommission] = useState(DUMMY_PLATFORM.commissionPercent)
  const [logoUrl,    setLogoUrl]    = useState(DUMMY_PLATFORM.logoUrl)
  const [timezone,   setTimezone]   = useState(DUMMY_PLATFORM.timezone)
  const [saved,      setSaved]      = useState(false)

  const dirty =
    name       !== DUMMY_PLATFORM.name               ||
    email      !== DUMMY_PLATFORM.supportEmail        ||
    commission !== DUMMY_PLATFORM.commissionPercent   ||
    logoUrl    !== DUMMY_PLATFORM.logoUrl             ||
    timezone   !== DUMMY_PLATFORM.timezone

  function save() { setSaved(true); setTimeout(() => setSaved(false), 2500) }

  return (
    <div className="space-y-5">
      <SectionCard
        title="Platform identity"
        desc="Core details that appear across the platform and in emails."
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Platform name">
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Platform name" />
          </Field>
          <Field label="Support email">
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="support@example.com"
            />
          </Field>
          <Field label="Logo URL" optional>
            <Input
              value={logoUrl}
              onChange={(e) => setLogoUrl(e.target.value)}
              placeholder="https://example.com/logo.png"
            />
          </Field>
          <Field label="Timezone">
            <Select value={timezone} onValueChange={setTimezone}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {TIMEZONES.map((tz) => (
                  <SelectItem key={tz.value} value={tz.value}>{tz.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        </div>
        <SaveBar onSave={save} saved={saved} disabled={!dirty} />
      </SectionCard>

      <SectionCard
        title="Platform commission"
        desc="Percentage cut taken from each event's gross revenue."
      >
        <div className="max-w-xs space-y-4">
          <Field
            label="Commission rate (%)"
            hint="Applied to all organizer payouts. Changes take effect on new events only."
          >
            <div className="relative">
              <Input
                type="number"
                min="0"
                max="100"
                step="0.5"
                value={commission}
                onChange={(e) => setCommission(e.target.value)}
                className="pr-9"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-medium pointer-events-none select-none">
                %
              </span>
            </div>
          </Field>
          <div className="rounded-xl bg-muted/50 border px-4 py-3 text-sm text-muted-foreground">
            Organisers keep{" "}
            <span className="font-semibold text-foreground">
              {Math.max(0, 100 - Number(commission || 0)).toFixed(1)}%
            </span>{" "}
            of their revenue.
          </div>
        </div>
        <SaveBar onSave={save} saved={saved} disabled={commission === DUMMY_PLATFORM.commissionPercent} />
      </SectionCard>
    </div>
  )
}
