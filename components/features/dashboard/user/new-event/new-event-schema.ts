import { z } from "zod"

export const EVENT_TYPES = [
  { label: "Awards Night",              value: "awards-night"        },
  { label: "Campus Elections",          value: "campus-elections"    },
  { label: "Faculty Excellence Awards", value: "faculty-excellence"  },
  { label: "Best of Department",        value: "best-of-department"  },
  { label: "Student Recognition",       value: "student-recognition" },
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

export const newEventSchema = z
  .object({
    // Event basics
    title:       z.string().min(3,  "Title must be at least 3 characters"),
    description: z.string().min(10, "Description must be at least 10 characters"),
    eventType:   z.string().min(1,  "Please select an event type"),
    institution: z.string().min(2,  "Institution / organisation name is required"),

    // Location & schedule
    location:     z.string().min(2, "Venue / location is required"),
    eventDate:    z.string().min(1, "Event date is required"),
    votingOpens:  z.string().min(1, "Voting open date is required"),
    votingCloses: z.string().min(1, "Voting close date is required"),

    // Voting setup
    currency:     z.string().min(1, "Please select a currency"),
    pricePerVote: z.coerce.number().min(0.01, "Price must be greater than 0"),

    // Event controls
    showVotes:              z.enum(["yes", "no"]),
    publicPage:             z.enum(["yes", "no"]),
    votingOpenByDefault:    z.enum(["yes", "no"]),
    nominationsEnabled:     z.enum(["yes", "no"]),
    autoPublishNominations: z.enum(["yes", "no"]),

    // Categories
    categories: z
      .array(
        z.object({
          name:        z.string().min(1, "Category name is required"),
          description: z.string().optional(),
        }),
      )
      .min(1, "Add at least one category before submitting"),
  })
  .refine(
    (d) =>
      !d.votingOpens ||
      !d.votingCloses ||
      new Date(d.votingCloses) > new Date(d.votingOpens),
    {
      message: "Voting close date must be after the open date",
      path: ["votingCloses"],
    },
  )

export type NewEventFormValues = z.infer<typeof newEventSchema>

export const NEW_EVENT_DEFAULTS: NewEventFormValues = {
  title:               "",
  description:         "",
  eventType:           "",
  institution:         "",
  location:            "",
  eventDate:           "",
  votingOpens:         "",
  votingCloses:        "",
  currency:            "",
  pricePerVote:        1,
  showVotes:              "yes",
  publicPage:             "yes",
  votingOpenByDefault:    "no",
  nominationsEnabled:     "yes",
  autoPublishNominations: "no",
  categories:             [],
}
