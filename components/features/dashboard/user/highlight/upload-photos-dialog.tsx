"use client"

import { useState, useRef, useEffect } from "react"
import { useForm, type Resolver } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import { Loader2, ImagePlus, X, Images } from "lucide-react"
import Image from "next/image"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form"
import { GALLERY_TAGS, getEventOptions } from "./gallery"

const MAX_PHOTOS = 3

const uploadSchema = z.object({
  eventId:      z.string().min(1, "Please select an event"),
  caption:      z.string().min(2, "Caption is required"),
  photographer: z.string().min(2, "Photographer name is required"),
  tag:          z.enum(["Winner", "Ceremony", "Award", "Behind the Scenes"] as const),
})

type UploadFormValues = z.infer<typeof uploadSchema>

const DEFAULTS: UploadFormValues = {
  eventId:      "",
  caption:      "",
  photographer: "",
  tag:          "Ceremony",
}

interface Props {
  open:         boolean
  onOpenChange: (open: boolean) => void
}

// ── Mobile detection ──────────────────────────────────────────────────────────

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640)
    check()
    window.addEventListener("resize", check)
    return () => window.removeEventListener("resize", check)
  }, [])
  return isMobile
}

// ── Photo slots ───────────────────────────────────────────────────────────────

function PhotoSlots({
  slots,
  onPick,
  onRemove,
}: {
  slots:    (string | null)[]
  onPick:   (index: number) => void
  onRemove: (index: number) => void
}) {
  const filled = slots.filter(Boolean).length
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">
          Photos <span className="text-destructive">*</span>
        </p>
        <span className="text-xs text-muted-foreground">{filled} / {MAX_PHOTOS}</span>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {slots.map((preview, i) => (
          <div key={i} className="relative aspect-square">
            {preview ? (
              <>
                <Image
                  src={preview}
                  alt={`Photo ${i + 1}`}
                  fill
                  className="object-cover rounded-lg border border-border"
                  unoptimized
                />
                <button
                  type="button"
                  onClick={() => onRemove(i)}
                  className="absolute -top-1.5 -right-1.5 size-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center shadow"
                  aria-label="Remove photo"
                >
                  <X className="size-3" />
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => onPick(i)}
                className="w-full h-full rounded-lg border-2 border-dashed border-border bg-muted/20 flex flex-col items-center justify-center gap-1 hover:border-primary/40 hover:bg-primary/5 transition-colors"
              >
                <ImagePlus className="size-5 text-muted-foreground" />
                <span className="text-[10px] text-muted-foreground">Add photo</span>
              </button>
            )}
          </div>
        ))}
      </div>

      <p className="text-[11px] text-muted-foreground/70">PNG, JPG or WEBP - max 3 photos per upload</p>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

export function UploadPhotosDialog({ open, onOpenChange }: Props) {
  const isMobile                    = useIsMobile()
  const [slots, setSlots]           = useState<(string | null)[]>([null, null, null])
  const [activeSlot, setActiveSlot] = useState(0)
  const [photoError, setPhotoError] = useState<string | null>(null)
  const inputRef                    = useRef<HTMLInputElement>(null)
  const eventOptions                = getEventOptions()

  const form = useForm<UploadFormValues>({
    resolver:      zodResolver(uploadSchema) as unknown as Resolver<UploadFormValues>,
    defaultValues: DEFAULTS,
  })

  const { formState: { isSubmitting } } = form

  function openPicker(index: number) {
    setActiveSlot(index)
    if (inputRef.current) {
      inputRef.current.value = ""
      inputRef.current.click()
    }
  }

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      setSlots((prev) => prev.map((s, i) => (i === activeSlot ? (ev.target?.result as string) : s)))
      setPhotoError(null)
    }
    reader.readAsDataURL(file)
  }

  function removeSlot(index: number) {
    setSlots((prev) => prev.map((s, i) => (i === index ? null : s)))
  }

  function handleClose() {
    form.reset()
    setSlots([null, null, null])
    setPhotoError(null)
    onOpenChange(false)
  }

  async function onSubmit(values: UploadFormValues) {
    const selected = slots.filter(Boolean)
    if (selected.length === 0) {
      setPhotoError("Please add at least one photo.")
      return
    }
    try {
      // TODO: Convex mutation when DB is wired up
      const event = eventOptions.find((e) => e.id === values.eventId)
      console.log("[UploadPhotos] submitted:", { ...values, photos: selected, eventName: event?.label })
      toast.success("Photos uploaded!", {
        description: `${selected.length} photo${selected.length > 1 ? "s" : ""} added to your highlights.`,
      })
      handleClose()
    } catch {
      toast.error("Upload failed", { description: "Something went wrong. Please try again." })
    }
  }

  // Shared form JSX — used inside both Sheet and Dialog
  const formContent = (
    <Form {...form}>
      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        className="sr-only"
        onChange={handleFile}
      />

      <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="space-y-4">
        <PhotoSlots slots={slots} onPick={openPicker} onRemove={removeSlot} />
        {photoError && (
          <p className="text-xs font-medium text-destructive">{photoError}</p>
        )}

        <FormField
          control={form.control}
          name="eventId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Event <span className="text-destructive">*</span></FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select an event" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {eventOptions.map((e) => (
                    <SelectItem key={e.id} value={e.id}>{e.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="caption"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Caption <span className="text-destructive">*</span></FormLabel>
              <FormControl>
                <Input placeholder="e.g. Best Developer winner on stage" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="photographer"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Photographer <span className="text-destructive">*</span></FormLabel>
              <FormControl>
                <Input placeholder="e.g. Kofi Lens Studio" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tag"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tag <span className="text-destructive">*</span></FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a tag" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {GALLERY_TAGS.map((tag) => (
                    <SelectItem key={tag} value={tag}>{tag}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-3 pt-1">
          <Button type="button" variant="outline" onClick={handleClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="size-4 mr-2 animate-spin" />}
            Upload
          </Button>
        </div>
      </form>
    </Form>
  )

  // ── Mobile: bottom sheet ──────────────────────────────────────────────────

  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent
          side="bottom"
          className="rounded-t-xl max-h-[92vh] overflow-y-auto px-5 pb-8 gap-0"
        >
          {/* Drag handle */}
          <div className="mx-auto w-10 h-1 rounded-full bg-border mt-2 mb-4" />
          <SheetHeader className="px-0 mb-4">
            <SheetTitle className="flex items-center gap-2">
              <Images className="size-4 text-primary" />
              Upload Photos
            </SheetTitle>
            <SheetDescription>
              Add photos from your event to your public highlights.
            </SheetDescription>
          </SheetHeader>
          {formContent}
        </SheetContent>
      </Sheet>
    )
  }

  // ── Desktop: centered dialog ──────────────────────────────────────────────

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Images className="size-4 text-primary" />
            Upload Photos
          </DialogTitle>
          <DialogDescription>
            Add photos from your event to your public highlights.
          </DialogDescription>
        </DialogHeader>
        {formContent}
      </DialogContent>
    </Dialog>
  )
}
