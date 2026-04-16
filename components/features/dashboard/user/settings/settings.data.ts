import {
  User,
  Bell,
  CreditCard,
  Sliders,
  ShieldCheck,
} from "lucide-react"

export const DUMMY_PROFILE = {
  name:  "Emmanuel Somuah",
  email: "emmanuel@example.com",
  bio:   "",
  role:  "organiser",
}

export const TABS = [
  { id: "profile",       label: "Profile",       icon: User        },
  { id: "notifications", label: "Notifications", icon: Bell        },
  { id: "billing",       label: "Billing",       icon: CreditCard  },
  { id: "defaults",      label: "Defaults",      icon: Sliders     },
  { id: "security",      label: "Security",      icon: ShieldCheck },
] as const

export type Tab = (typeof TABS)[number]["id"]

export const NOTIFICATION_PREFS = [
  { key: "milestones", label: "Vote milestones",    desc: "When your event crosses a vote count threshold.",        default: true  },
  { key: "closing",    label: "Event closing soon", desc: "A reminder 48 hours before voting ends.",               default: true  },
  { key: "revenue",    label: "Revenue milestones", desc: "When your total earnings cross a new threshold.",        default: true  },
  { key: "nominees",   label: "New nominees",       desc: "When a nominee is added to one of your events.",        default: false },
  { key: "summary",    label: "Weekly digest",      desc: "A weekly roll-up of votes, revenue, and top nominees.", default: true  },
] as const

export type NotifKey = (typeof NOTIFICATION_PREFS)[number]["key"]

export const PAYOUT_METHODS = [
  { id: "momo", label: "Mobile Money",  desc: "MTN, Vodafone, AirtelTigo" },
  { id: "bank", label: "Bank Transfer", desc: "Any Ghanaian bank"         },
] as const

export type PayoutMethod = (typeof PAYOUT_METHODS)[number]["id"]

export const MOMO_NETWORKS = [
  { value: "mtn",        label: "MTN Mobile Money" },
  { value: "vodafone",   label: "Vodafone Cash"     },
  { value: "airteltigo", label: "AirtelTigo Money"  },
]

export const CURRENCIES = [
  { value: "GHS", label: "GHS - Ghana Cedi"   },
  { value: "USD", label: "USD - US Dollar"     },
  { value: "EUR", label: "EUR - Euro"          },
  { value: "GBP", label: "GBP - British Pound" },
]

export const DEFAULT_EVENT_SETTINGS = {
  currency:  "GHS",
  priceVote: "1.00",
}

export const PASSWORD_FIELDS = [
  { id: "cur-pw",  label: "Current password",    placeholder: "Your current password"    },
  { id: "new-pw",  label: "New password",         placeholder: "At least 8 characters"   },
  { id: "conf-pw", label: "Confirm new password", placeholder: "Repeat your new password" },
] as const

export type PwFieldId = (typeof PASSWORD_FIELDS)[number]["id"]
