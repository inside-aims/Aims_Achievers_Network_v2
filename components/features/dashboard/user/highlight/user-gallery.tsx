"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Upload, Camera, Calendar, Tag, Trash2, Images } from "lucide-react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PageHeader } from "@/components/features/dashboard/shared/page-header"
import { UploadPhotosDialog } from "./upload-photos-dialog"
import { MOCK_GALLERY, type GalleryEntry } from "./gallery"
import { formatDateMedium } from "@/lib/date-utils"

const TAG_COLORS: Record<string, string> = {
  "Winner":            "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
  "Ceremony":          "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
  "Award":             "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300",
  "Behind the Scenes": "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300",
}

// ── Single gallery card ───────────────────────────────────────────────────────

function GalleryCard({ entry, onDelete }: { entry: GalleryEntry; onDelete: (id: string) => void }) {
  const extraCount = entry.photos.length - 1

  return (
    <Card className="overflow-hidden group p-0 gap-0">
      {/* Thumbnail */}
      <div className="relative aspect-video">
        <Image
          src={entry.photos[0]}
          alt={entry.caption}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          unoptimized
        />

        {/* Multi-photo badge */}
        {extraCount > 0 && (
          <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-black/60 text-white text-[11px] font-medium px-2 py-0.5 rounded-full">
            <Images className="size-3" />
            +{extraCount}
          </div>
        )}

        {/* Delete button - visible on hover */}
        <button
          onClick={() => onDelete(entry.id)}
          className="absolute top-2 right-2 size-7 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive"
          aria-label="Delete entry"
        >
          <Trash2 className="size-3.5" />
        </button>
      </div>

      {/* Details */}
      <CardContent className="p-3 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-medium leading-snug line-clamp-2">{entry.caption}</p>
          <Badge
            variant="secondary"
            className={`text-[10px] shrink-0 ${TAG_COLORS[entry.tag] ?? ""}`}
          >
            {entry.tag}
          </Badge>
        </div>

        <div className="space-y-1 text-[11px] text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Tag className="size-3 shrink-0" />
            <span className="truncate">{entry.eventName}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Camera className="size-3 shrink-0" />
            <span className="truncate">{entry.photographer}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="size-3 shrink-0" />
            <span>{formatDateMedium(entry.uploadedAt)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

export function UserGallery() {
  const [dialogOpen, setDialogOpen]   = useState(false)
  const [entries, setEntries]         = useState<GalleryEntry[]>(MOCK_GALLERY)

  function handleDelete(id: string) {
    setEntries((prev) => prev.filter((e) => e.id !== id))
    toast.success("Removed", { description: "Photo entry removed from your gallery." })
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Gallery"
        description="Manage photos from your events that appear on the public gallery."
        action={
          <Button size="sm" onClick={() => setDialogOpen(true)}>
            <Upload className="size-3.5 mr-1.5" />
            Upload Photos
          </Button>
        }
      />

      {entries.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border py-20 gap-3 text-center">
          <Images className="size-10 text-muted-foreground/40" />
          <div>
            <p className="font-medium">No photos yet</p>
            <p className="text-sm text-muted-foreground mt-0.5">
              Upload photos from your events to have them appear on the public gallery.
            </p>
          </div>
          <Button size="sm" variant="outline" onClick={() => setDialogOpen(true)}>
            <Upload className="size-3.5 mr-1.5" />
            Upload Photos
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {entries.map((entry) => (
            <GalleryCard key={entry.id} entry={entry} onDelete={handleDelete} />
          ))}
        </div>
      )}

      <UploadPhotosDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  )
}
