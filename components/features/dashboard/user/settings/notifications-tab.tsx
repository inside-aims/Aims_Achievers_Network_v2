"use client"

import { useState } from "react"
import { NOTIFICATION_PREFS, type NotifKey } from "./settings.data"
import { Toggle, SaveBar, SectionCard } from "./settings-primitives"

export function NotificationsTab() {
  const [prefs, setPrefs] = useState<Record<NotifKey, boolean>>(
    Object.fromEntries(
      NOTIFICATION_PREFS.map(({ key, default: d }) => [key, d]),
    ) as Record<NotifKey, boolean>,
  )
  const [saved, setSaved] = useState(false)

  const dirty = NOTIFICATION_PREFS.some(({ key, default: d }) => prefs[key] !== d)

  function save() { setSaved(true); setTimeout(() => setSaved(false), 2500) }

  return (
    <SectionCard
      title="Notification preferences"
      desc="Choose what activity triggers a notification in your panel."
    >
      <div className="divide-y">
        {NOTIFICATION_PREFS.map(({ key, label, desc }) => (
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
