"use client"

import { useState } from "react"
import { ADMIN_NOTIFICATION_PREFS, type AdminNotifKey } from "./admin-settings.data"
import { Toggle, SaveBar, SectionCard } from "@/components/features/dashboard/user/settings/settings-primitives"

export function AdminNotificationsTab() {
  const [prefs, setPrefs] = useState<Record<AdminNotifKey, boolean>>(
    Object.fromEntries(
      ADMIN_NOTIFICATION_PREFS.map(({ key, default: d }) => [key, d]),
    ) as Record<AdminNotifKey, boolean>,
  )
  const [saved, setSaved] = useState(false)

  const dirty = ADMIN_NOTIFICATION_PREFS.some(({ key, default: d }) => prefs[key] !== d)

  function save() { setSaved(true); setTimeout(() => setSaved(false), 2500) }

  return (
    <SectionCard
      title="Admin notification preferences"
      desc="Choose which platform events send you a notification."
    >
      <div className="divide-y">
        {ADMIN_NOTIFICATION_PREFS.map(({ key, label, desc }) => (
          <div key={key} className="flex items-center justify-between gap-6 py-4 first:pt-0 last:pb-0">
            <div>
              <p className="text-sm font-medium">{label}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
            </div>
            <Toggle
              checked={prefs[key]}
              onChange={(v) => setPrefs((p) => ({ ...p, [key]: v }))}
            />
          </div>
        ))}
      </div>
      <SaveBar onSave={save} saved={saved} disabled={!dirty} />
    </SectionCard>
  )
}
