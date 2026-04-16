"use client"

import { useState } from "react"
import { toast } from "sonner"
import {
  Upload,
  Camera,
  Sparkles,
  Trash2,
  Images,
  ChevronLeft,
  ChevronRight,
  X,
  Building2,
  ChevronDown,
  Calendar,
} from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog"
import { PageHeader } from "@/components/features/dashboard/shared/page-header"
import { UploadPhotosDialog } from "./upload-photos-dialog"
import { MOCK_GALLERY, type GalleryEntry } from "./gallery"
import { formatDateMedium } from "@/lib/date-utils"
import { cn } from "@/lib/utils"

// ── Constants ─────────────────────────────────────────────────────────────────

const TAG_COLORS: Record<string, string> = {
  "Winner":            "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
  "Ceremony":          "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
  "Award":             "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300",
  "Behind the Scenes": "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300",
}

// ── Types ─────────────────────────────────────────────────────────────────────

interface ViewerState {
  entry:      GalleryEntry
  photoIndex: number
}

interface PhotoItem {
  entry:      GalleryEntry
  photoIndex: number
  src:        string
}

interface EventGroup {
  eventId:     string
  eventName:   string
  institution: string
  photoCount:  number
  items:       PhotoItem[]
}

// ── Photo viewer ──────────────────────────────────────────────────────────────

function PhotoViewer({
  state,
  onClose,
  onNavigate,
}: {
  state:      ViewerState | null
  onClose:    () => void
  onNavigate: (direction: "prev" | "next") => void
}) {
  if (!state) return null
  const { entry, photoIndex } = state
  const total   = entry.photos.length
  const hasPrev = photoIndex > 0
  const hasNext = photoIndex < total - 1

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent
        showCloseButton={false}
        className="sm:max-w-2xl p-0 gap-0 overflow-hidden"
      >
        <DialogTitle className="sr-only">{entry.caption}</DialogTitle>

        {/* Image */}
        <div className="relative bg-black aspect-video">
          <Image
            src={entry.photos[photoIndex]}
            alt={entry.caption}
            fill
            className="object-contain"
            unoptimized
          />

          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 size-8 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors z-10"
            aria-label="Close"
          >
            <X className="size-4" />
          </button>

          {/* Prev / next */}
          {total > 1 && (
            <>
              <button
                onClick={() => onNavigate("prev")}
                disabled={!hasPrev}
                className={cn(
                  "absolute left-3 top-1/2 -translate-y-1/2 size-8 rounded-full bg-black/60 text-white flex items-center justify-center transition-colors",
                  hasPrev ? "hover:bg-black/80" : "opacity-30 cursor-not-allowed",
                )}
                aria-label="Previous photo"
              >
                <ChevronLeft className="size-4" />
              </button>
              <button
                onClick={() => onNavigate("next")}
                disabled={!hasNext}
                className={cn(
                  "absolute right-3 top-1/2 -translate-y-1/2 size-8 rounded-full bg-black/60 text-white flex items-center justify-center transition-colors",
                  hasNext ? "hover:bg-black/80" : "opacity-30 cursor-not-allowed",
                )}
                aria-label="Next photo"
              >
                <ChevronRight className="size-4" />
              </button>

              {/* Dot indicators */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                {entry.photos.map((_, i) => (
                  <div
                    key={i}
                    className={cn(
                      "size-1.5 rounded-full transition-colors",
                      i === photoIndex ? "bg-white" : "bg-white/40",
                    )}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Meta */}
        <div className="p-4 space-y-3">
          <div className="flex items-start justify-between gap-3">
            <p className="font-medium leading-snug">{entry.caption}</p>
            <Badge
              variant="secondary"
              className={cn("text-[11px] shrink-0", TAG_COLORS[entry.tag] ?? "")}
            >
              {entry.tag}
            </Badge>
          </div>

          <div className="flex flex-wrap gap-x-5 gap-y-1.5 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Camera className="size-3.5 shrink-0" />
              {entry.photographer}
            </span>
            <span className="flex items-center gap-1.5">
              <Building2 className="size-3.5 shrink-0" />
              {entry.institution}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="size-3.5 shrink-0" />
              {formatDateMedium(entry.uploadedAt)}
            </span>
            {total > 1 && (
              <span className="flex items-center gap-1.5">
                <Images className="size-3.5 shrink-0" />
                {photoIndex + 1} of {total}
              </span>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// ── Single photo tile ─────────────────────────────────────────────────────────

function PhotoTile({
  item,
  onView,
  onDelete,
}: {
  item:     PhotoItem
  onView:   (entry: GalleryEntry, index: number) => void
  onDelete: (id: string) => void
}) {
  return (
    <div
      className="relative aspect-square cursor-pointer group overflow-hidden rounded-lg border border-border"
      onClick={() => onView(item.entry, item.photoIndex)}
    >
      <Image
        src={item.src}
        alt={item.entry.caption}
        fill
        className="object-cover transition-transform duration-300 group-hover:scale-105"
        unoptimized
      />

      {/* Tag badge */}
      <div className="absolute top-2 left-2">
        <span className={cn(
          "text-[10px] font-medium px-2 py-0.5 rounded-full",
          TAG_COLORS[item.entry.tag] ?? "",
        )}>
          {item.entry.tag}
        </span>
      </div>

      {/* Caption overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="absolute bottom-2 left-2 right-2">
          <p className="text-white text-xs font-medium line-clamp-2">{item.entry.caption}</p>
        </div>
      </div>

      {/* Delete */}
      <button
        onClick={(e) => { e.stopPropagation(); onDelete(item.entry.id) }}
        className="absolute top-2 right-2 size-6 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive"
        aria-label="Remove entry"
      >
        <Trash2 className="size-3" />
      </button>
    </div>
  )
}

// ── Accordion event section ───────────────────────────────────────────────────

function EventSection({
  group,
  isOpen,
  onToggle,
  onView,
  onDelete,
}: {
  group:    EventGroup
  isOpen:   boolean
  onToggle: () => void
  onView:   (entry: GalleryEntry, index: number) => void
  onDelete: (id: string) => void
}) {
  return (
    <div className="border border-border rounded-lg overflow-hidden">
      {/* Accordion header */}
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 px-4 py-3.5 bg-card hover:bg-accent/50 transition-colors text-left"
      >
        <div className="min-w-0">
          <p className="font-semibold text-sm truncate">{group.eventName}</p>
          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5 truncate">
            <Building2 className="size-3 shrink-0" />
            {group.institution}
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Images className="size-3.5" />
            {group.photoCount}
          </span>
          <ChevronDown
            className={cn(
              "size-4 text-muted-foreground transition-transform duration-300",
              isOpen && "rotate-180",
            )}
          />
        </div>
      </button>

      {/* Collapsible grid — grid-rows animation trick */}
      <div
        className={cn(
          "grid transition-[grid-template-rows] duration-300",
          isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
      >
        <div className="min-h-0 overflow-hidden">
          <div className="p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {group.items.map((item, i) => (
              <PhotoTile
                key={`${item.entry.id}-${i}`}
                item={item}
                onView={onView}
                onDelete={onDelete}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

export function UserHighlights() {
  const [uploadOpen, setUploadOpen] = useState(false)
  const [entries, setEntries]       = useState<GalleryEntry[]>(MOCK_GALLERY)
  const [viewer, setViewer]         = useState<ViewerState | null>(null)

  // Group entries by event; flatten photos into individual PhotoItems
  const groups = entries.reduce<EventGroup[]>((acc, entry) => {
    const items: PhotoItem[] = entry.photos.map((src, i) => ({ entry, photoIndex: i, src }))
    const existing = acc.find((g) => g.eventId === entry.eventId)
    if (existing) {
      existing.items.push(...items)
      existing.photoCount += entry.photos.length
    } else {
      acc.push({
        eventId:     entry.eventId,
        eventName:   entry.eventName,
        institution: entry.institution,
        photoCount:  entry.photos.length,
        items,
      })
    }
    return acc
  }, [])

  // Only one section open at a time; first event open by default
  const [expandedId, setExpandedId] = useState<string | null>(
    groups[0]?.eventId ?? null,
  )

  function toggle(eventId: string) {
    setExpandedId((prev) => (prev === eventId ? null : eventId))
  }

  function openViewer(entry: GalleryEntry, photoIndex: number) {
    setViewer({ entry, photoIndex })
  }

  function navigate(direction: "prev" | "next") {
    setViewer((prev) => {
      if (!prev) return prev
      const next = direction === "prev" ? prev.photoIndex - 1 : prev.photoIndex + 1
      if (next < 0 || next >= prev.entry.photos.length) return prev
      return { ...prev, photoIndex: next }
    })
  }

  function handleDelete(id: string) {
    setEntries((prev) => prev.filter((e) => e.id !== id))
    if (viewer?.entry.id === id) setViewer(null)
    toast.success("Removed", { description: "Photo entry removed from your highlights." })
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Highlights"
        description="Share photos from your events so the public can see how they went."
        action={
          <Button size="sm" onClick={() => setUploadOpen(true)}>
            <Upload className="size-3.5 mr-1.5" />
            Upload Photos
          </Button>
        }
      />

      {groups.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border py-20 gap-3 text-center px-4">
          <Sparkles className="size-10 text-muted-foreground/40" />
          <div>
            <p className="font-medium">No highlights yet</p>
            <p className="text-sm text-muted-foreground mt-0.5 max-w-xs mx-auto">
              Upload photos from your events and let people see how they went.
            </p>
          </div>
          <Button size="sm" variant="outline" onClick={() => setUploadOpen(true)}>
            <Upload className="size-3.5 mr-1.5" />
            Upload Photos
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {groups.map((group) => (
            <EventSection
              key={group.eventId}
              group={group}
              isOpen={expandedId === group.eventId}
              onToggle={() => toggle(group.eventId)}
              onView={openViewer}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <UploadPhotosDialog open={uploadOpen} onOpenChange={setUploadOpen} />

      {viewer && (
        <PhotoViewer
          state={viewer}
          onClose={() => setViewer(null)}
          onNavigate={navigate}
        />
      )}
    </div>
  )
}
