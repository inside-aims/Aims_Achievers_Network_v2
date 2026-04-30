"use client"

import { Suspense } from "react"
import type { ReactNode } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { cn } from "@/lib/utils"
import { TABS, type Tab } from "./settings.data"
import { ProfileTab } from "./profile-tab"
import { BillingTab } from "./billing-tab"
import { DefaultsTab } from "./defaults-tab"
import { SecurityTab } from "./security-tab"

const VALID_TABS = TABS.map((t) => t.id) as Tab[]

const TAB_CONTENT: Record<Tab, ReactNode> = {
  profile:  <ProfileTab />,
  billing:  <BillingTab />,
  defaults: <DefaultsTab />,
  security: <SecurityTab />,
}

function UserSettingsInner() {
  const router     = useRouter()
  const params     = useSearchParams()
  const raw        = params.get("tab") as Tab | null
  const active     = raw && VALID_TABS.includes(raw) ? raw : "profile"

  function switchTab(tab: Tab) {
    router.push(`?tab=${tab}`, { scroll: false })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your profile, billing, and security.
        </p>
      </div>

      <div className="flex gap-1 overflow-x-auto pb-px no-scrollbar border-b">
        {TABS.map(({ id, label, icon: Icon }) => (
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

export function UserSettings() {
  return (
    <Suspense fallback={<div className="h-10" />}>
      <UserSettingsInner />
    </Suspense>
  )
}
