"use client"

import { Suspense } from "react"
import type { ReactNode } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { cn } from "@/lib/utils"
import { ADMIN_TABS, type AdminTab } from "./admin-settings.data"
import { PlatformTab } from "./platform-tab"
import { PayoutsTab } from "./payouts-tab"
import { AdminNotificationsTab } from "./admin-notifications-tab"
import { AdminSecurityTab } from "./admin-security-tab"

const VALID_TABS = ADMIN_TABS.map((t) => t.id) as AdminTab[]

const TAB_CONTENT: Record<AdminTab, ReactNode> = {
  platform:      <PlatformTab />,
  payouts:       <PayoutsTab />,
  notifications: <AdminNotificationsTab />,
  security:      <AdminSecurityTab />,
}

function AdminSettingsInner() {
  const router = useRouter()
  const params = useSearchParams()
  const raw    = params.get("tab") as AdminTab | null
  const active = raw && VALID_TABS.includes(raw) ? raw : "platform"

  function switchTab(tab: AdminTab) {
    router.push(`?tab=${tab}`, { scroll: false })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Admin Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Configure platform-wide rules, payouts, and admin account security.
        </p>
      </div>

      <div className="flex gap-1 overflow-x-auto pb-px no-scrollbar border-b">
        {ADMIN_TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => switchTab(id)}
            className={cn(
              "flex items-center gap-2 px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-colors relative shrink-0",
              active === id ? "text-foreground" : "text-muted-foreground hover:text-foreground",
            )}
          >
            <Icon className="size-3.5 shrink-0" />
            {label}
            {active === id && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary rounded-t-full" />
            )}
          </button>
        ))}
      </div>

      <div>{TAB_CONTENT[active]}</div>
    </div>
  )
}

export function AdminSettings() {
  return (
    <Suspense fallback={<div className="h-10" />}>
      <AdminSettingsInner />
    </Suspense>
  )
}
