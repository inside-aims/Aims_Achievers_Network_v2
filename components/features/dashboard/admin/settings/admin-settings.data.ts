import { LayoutDashboard, CreditCard, Bell, ShieldCheck } from "lucide-react"

export const ADMIN_TABS = [
  { id: "platform",      label: "Platform",      icon: LayoutDashboard },
  { id: "payouts",       label: "Payouts",        icon: CreditCard      },
  { id: "notifications", label: "Notifications",  icon: Bell            },
  { id: "security",      label: "Security",       icon: ShieldCheck     },
] as const

export type AdminTab = (typeof ADMIN_TABS)[number]["id"]

export const DUMMY_PLATFORM = {
  name:               "AIMS Achievers Network",
  supportEmail:       "support@aimsachievers.com",
  commissionPercent:  "10",
  logoUrl:            "",
  timezone:           "Africa/Accra",
}

export const TIMEZONES = [
  { value: "Africa/Accra",    label: "Africa/Accra (GMT+0)"   },
  { value: "Africa/Lagos",    label: "Africa/Lagos (GMT+1)"   },
  { value: "Africa/Nairobi",  label: "Africa/Nairobi (GMT+3)" },
  { value: "Europe/London",   label: "Europe/London (GMT+0)"  },
  { value: "America/New_York", label: "America/New_York (GMT-5)" },
]

export const DUMMY_PAYOUT_CONFIG = {
  globalMinPayout:       "50.00",
  autoApproveThreshold:  "500.00",
  schedule:              "monthly",
}

export const PAYOUT_SCHEDULES = [
  { value: "weekly",    label: "Weekly"     },
  { value: "biweekly",  label: "Bi-weekly"  },
  { value: "monthly",   label: "Monthly"    },
  { value: "manual",    label: "Manual only" },
]

export const ADMIN_NOTIFICATION_PREFS = [
  {
    key:     "new_organizer",
    label:   "New organizer registered",
    desc:    "When a new organizer account is created on the platform.",
    default: true,
  },
  {
    key:     "payout_request",
    label:   "Payout requests",
    desc:    "When an organizer submits a payout request for review.",
    default: true,
  },
  {
    key:     "high_revenue",
    label:   "High-revenue events",
    desc:    "When an event surpasses GHS 5,000 in gross revenue.",
    default: true,
  },
  {
    key:     "flagged_event",
    label:   "Flagged events",
    desc:    "When an event is reported or flagged for review.",
    default: true,
  },
  {
    key:     "weekly_digest",
    label:   "Weekly platform digest",
    desc:    "A weekly summary of platform-wide votes, revenue, and organizer activity.",
    default: true,
  },
  {
    key:     "system_alerts",
    label:   "System alerts",
    desc:    "Critical errors, failed payments, or infrastructure issues.",
    default: true,
  },
] as const

export type AdminNotifKey = (typeof ADMIN_NOTIFICATION_PREFS)[number]["key"]

export const ADMIN_PASSWORD_FIELDS = [
  { id: "cur-pw",  label: "Current password",    placeholder: "Your current password"    },
  { id: "new-pw",  label: "New password",         placeholder: "At least 8 characters"   },
  { id: "conf-pw", label: "Confirm new password", placeholder: "Repeat your new password" },
] as const

export type AdminPwFieldId = (typeof ADMIN_PASSWORD_FIELDS)[number]["id"]
