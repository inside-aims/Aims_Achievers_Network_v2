import { z } from "zod"
import { validateTicketTypeDraft } from "@/components/features/tickets/ticket-type-editor"

export const EVENT_FORMATS = [
  {
    value: "awards",
    label: "Awards / Voting Event",
    description: "Categories, nominees, and paid voting — ticket sales are an optional add-on.",
  },
  {
    value: "ticket-only",
    label: "Ticket-Only Event",
    description: "Just sell entry tickets. No categories, no voting.",
  },
] as const

export type EventFormat = (typeof EVENT_FORMATS)[number]["value"]

export const EVENT_TYPES = [
  { label: "Awards Night",              value: "awards-night"        },
  { label: "Campus Elections",          value: "campus-elections"    },
  { label: "Faculty Excellence Awards", value: "faculty-excellence"  },
  { label: "Best of Department",        value: "best-of-department"  },
  { label: "Student Recognition",       value: "student-recognition" },
  { label: "General / Ticketed Event",  value: "general-event"       },
  { label: "Other",                     value: "other"               },
] as const

export const CURRENCIES = [
  { label: "GHS - Ghanaian Cedi",   value: "GHS" },
  { label: "USD - US Dollar",       value: "USD" },
  { label: "EUR - Euro",            value: "EUR" },
  { label: "GBP - British Pound",   value: "GBP" },
  { label: "NGN - Nigerian Naira",  value: "NGN" },
  { label: "KES - Kenyan Shilling", value: "KES" },
] as const

const ticketTypeDraftSchema = z.object({
  name:          z.string(),
  priceGhs:      z.string(),
  quantityTotal: z.string(),
})

// Mirrors the server-side check (convex/events.ts's assertHttpUrl) — a
// startsWith("http://") check alone accepts garbage like "http:// foo".
// Browsers' URL parser is more lenient than Node/Convex's and silently
// percent-encodes stray characters (e.g. spaces) instead of throwing, so
// reject those outright before even trying new URL().
function isHttpUrl(url: string): boolean {
  if (/\s/.test(url)) return false
  try {
    const protocol = new URL(url).protocol
    return protocol === "http:" || protocol === "https:"
  } catch {
    return false
  }
}

const optionalHttpUrl = z
  .string()
  .refine(
    (url) => url.trim() === "" || isHttpUrl(url),
    "URL must start with http:// or https://",
  )
  .optional()

export const newEventSchema = z
  .object({
    // Client-only concept — branches which sections render and how the
    // submit payload is shaped. Never sent to Convex.
    eventFormat: z.enum(["awards", "ticket-only"]),
    // Client-only — true when the form is editing an existing event, which
    // skips the categories/ticket-types-required checks below (those
    // sections aren't shown in edit mode).
    isEditMode: z.boolean(),

    // Cover image — storageId returned from Convex storage upload
    bannerStorageId: z.string().optional(),

    // Event basics
    title:       z.string().min(3,  "Title must be at least 3 characters"),
    description: z.string().min(10, "Description must be at least 10 characters"),
    eventType:   z.string().min(1,  "Please select an event type"),
    institution: z.string().min(2,  "Institution / organisation name is required"),
    currency:    z.string(),

    // Location & schedule
    location:     z.string().min(2, "Venue / location is required"),
    eventDate:    z.string().min(1, "Event date is required"),
    eventTime:    z.string().min(1, "Event time is required"),
    // Required only for "awards" format — enforced in superRefine below.
    votingOpens:  z.string(),
    votingCloses: z.string(),

    // Voting setup — required only for "awards" format.
    pricePerVote: z.coerce.number().min(0, "Price must be 0 or greater"),

    // Event controls
    showVotes:              z.enum(["yes", "no"]),
    publicPage:             z.enum(["yes", "no"]),
    votingOpenByDefault:    z.enum(["yes", "no"]),
    nominationsEnabled:     z.enum(["yes", "no"]),
    autoPublishNominations: z.enum(["yes", "no"]),

    // Ticketing — always required for "ticket-only", optional add-on for "awards".
    ticketingEnabled: z.enum(["yes", "no"]),
    themeId:          z.string(),
    ticketTypes:      z.array(ticketTypeDraftSchema),

    // Categories — required only for "awards" format, and only at creation.
    categories: z
      .array(
        z.object({
          name:        z.string().min(1, "Category name is required"),
          description: z.string().optional(),
        }),
      ),

    // Event details
    agenda: z.array(
      z.object({
        time:        z.string().min(1, "Time is required"),
        title:       z.string().min(1, "Title is required"),
        description: z.string().optional(),
      }),
    ),
    lineup: z.array(
      z.object({
        name:     z.string().min(1, "Name is required"),
        role:     z.string().min(1, "Role is required"),
        imageUrl: optionalHttpUrl,
      }),
    ),
    dressCode:      z.string().optional(),
    ageRestriction: z.string().optional(),
    venueNotes:     z.string().optional(),
    refundPolicy:   z.string().optional(),
    termsNote:      z.string().optional(),
    contactEmail: z
      .string()
      .refine((v) => v.trim() === "" || z.string().email().safeParse(v).success, "Invalid email address")
      .optional(),
    contactPhone: z.string().optional(),
    socialLinks: z.array(
      z.object({
        platform: z.string().min(1, "Platform is required"),
        url:      z.string().min(1, "URL is required").refine(
          isHttpUrl,
          "URL must start with http:// or https://",
        ),
      }),
    ),
    faqs: z.array(
      z.object({
        question: z.string().min(1, "Question is required"),
        answer:   z.string().min(1, "Answer is required"),
      }),
    ),
    sponsors: z.array(
      z.object({
        name:    z.string().min(1, "Name is required"),
        logoUrl: optionalHttpUrl,
      }),
    ),
  })
  .superRefine((data, ctx) => {
    const isAwards     = data.eventFormat === "awards"
    const isTicketOnly = data.eventFormat === "ticket-only"

    if (!data.currency) {
      ctx.addIssue({ path: ["currency"], code: z.ZodIssueCode.custom, message: "Please select a currency" })
    }

    if (isAwards) {
      if (!data.votingOpens) {
        ctx.addIssue({ path: ["votingOpens"], code: z.ZodIssueCode.custom, message: "Voting open date is required" })
      }
      if (!data.votingCloses) {
        ctx.addIssue({ path: ["votingCloses"], code: z.ZodIssueCode.custom, message: "Voting close date is required" })
      }
      if (data.votingOpens && data.votingCloses && new Date(data.votingCloses) <= new Date(data.votingOpens)) {
        ctx.addIssue({ path: ["votingCloses"], code: z.ZodIssueCode.custom, message: "Voting close date must be after the open date" })
      }
      if (!(data.pricePerVote > 0)) {
        ctx.addIssue({ path: ["pricePerVote"], code: z.ZodIssueCode.custom, message: "Price must be greater than 0" })
      }
      if (!data.isEditMode && data.categories.length < 1) {
        ctx.addIssue({ path: ["categories"], code: z.ZodIssueCode.custom, message: "Add at least one category before submitting" })
      }
    }

    if (isTicketOnly && !data.isEditMode && data.ticketTypes.length < 1) {
      ctx.addIssue({ path: ["ticketTypes"], code: z.ZodIssueCode.custom, message: "Add at least one ticket type" })
    }

    // Ticket rows are validated whenever ticketing is actually active for either format.
    const ticketingActive = isTicketOnly || data.ticketingEnabled === "yes"
    if (ticketingActive) {
      data.ticketTypes.forEach((tt, i) => {
        const err = validateTicketTypeDraft(tt)
        if (err) {
          ctx.addIssue({ path: ["ticketTypes", i, "name"], code: z.ZodIssueCode.custom, message: err })
        }
      })
    }
  })

export type NewEventFormValues = z.infer<typeof newEventSchema>

export const NEW_EVENT_DEFAULTS: NewEventFormValues = {
  eventFormat:         "awards",
  isEditMode:          false,
  bannerStorageId:     undefined,
  title:               "",
  description:         "",
  eventType:           "",
  institution:         "",
  currency:            "",
  location:            "",
  eventDate:           "",
  eventTime:           "",
  votingOpens:         "",
  votingCloses:        "",
  pricePerVote:        1,
  showVotes:              "yes",
  publicPage:             "yes",
  votingOpenByDefault:    "no",
  nominationsEnabled:     "yes",
  autoPublishNominations: "no",
  ticketingEnabled:       "no",
  themeId:                "royal-night",
  ticketTypes:            [],
  categories:             [],
  agenda:                 [],
  lineup:                 [],
  dressCode:              "",
  ageRestriction:         "",
  venueNotes:             "",
  refundPolicy:           "",
  termsNote:              "",
  contactEmail:           "",
  contactPhone:           "",
  socialLinks:            [],
  faqs:                   [],
  sponsors:               [],
}
