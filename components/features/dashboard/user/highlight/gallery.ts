import { MOCK_EVENT_DETAILS } from "../events/events"

export type GalleryTag = "Winner" | "Ceremony" | "Award" | "Behind the Scenes"

export const GALLERY_TAGS: GalleryTag[] = [
  "Winner",
  "Ceremony",
  "Award",
  "Behind the Scenes",
]

export interface GalleryEntry {
  id:           string
  eventId:      string
  eventName:    string
  institution:  string
  photos:       string[]   // 1-3 URLs
  caption:      string
  photographer: string
  tag:          GalleryTag
  uploadedAt:   string     // ISO date
}

export function getEventOptions() {
  return Object.values(MOCK_EVENT_DETAILS).map((e) => ({
    id:          e.id,
    label:       e.title,
    institution: e.institution,
  }))
}

export const MOCK_GALLERY: GalleryEntry[] = [
  {
    id:           "g-1",
    eventId:      "evt-1",
    eventName:    "FAST Excellence Awards 2025",
    institution:  "Koforidua Technical University",
    photos: [
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&h=600&fit=crop",
    ],
    caption:      "Award ceremony opening night",
    photographer: "Kofi Lens Studio",
    tag:          "Ceremony",
    uploadedAt:   "2025-06-16T10:00:00Z",
  },
  {
    id:           "g-2",
    eventId:      "evt-1",
    eventName:    "FAST Excellence Awards 2025",
    institution:  "Koforidua Technical University",
    photos: [
      "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&h=600&fit=crop",
    ],
    caption:      "Best Developer winner Ada Mensah receiving her award",
    photographer: "Kofi Lens Studio",
    tag:          "Winner",
    uploadedAt:   "2025-06-16T11:30:00Z",
  },
  {
    id:           "g-3",
    eventId:      "evt-2",
    eventName:    "FOE Engineering Awards 2025",
    institution:  "Kwame Nkrumah University of Science and Technology",
    photos: [
      "https://images.unsplash.com/photo-1540574163026-643ea20ade25?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&h=600&fit=crop",
    ],
    caption:      "Best Engineer award presentation",
    photographer: "Ama Photography",
    tag:          "Award",
    uploadedAt:   "2025-04-21T09:00:00Z",
  },
]
