"use client"

import { useState, useRef } from "react"
import { ImageIcon, X, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Button } from "@/components/ui/button"

interface Props {
  onStorageId: (id: string | null) => void
}

export function EventCoverSection({ onStorageId }: Props) {
  const [preview, setPreview]     = useState<string | null>(null)
  const [fileName, setFileName]   = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const generateUploadUrl = useMutation(api.fileStorage.generateUploadUrl)

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    // Local preview immediately
    const reader = new FileReader()
    reader.onload = (ev) => setPreview(ev.target?.result as string)
    reader.readAsDataURL(file)
    setFileName(file.name)

    // Upload to Convex storage
    setUploading(true)
    try {
      const uploadUrl = await generateUploadUrl()
      const res = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      })
      if (!res.ok) throw new Error(`Upload failed: ${res.status}`)
      const { storageId } = await res.json() as { storageId: string }
      onStorageId(storageId)
    } catch (err) {
      toast.error("Cover upload failed", {
        description: "Please try again or skip the cover image.",
      })
      // Revert preview on failure
      setPreview(null)
      setFileName(null)
      onStorageId(null)
      if (inputRef.current) inputRef.current.value = ""
    } finally {
      setUploading(false)
    }
  }

  function clearFile() {
    setPreview(null)
    setFileName(null)
    onStorageId(null)
    if (inputRef.current) inputRef.current.value = ""
  }

  return (
    <div className="form-section">
      <div>
        <h2 className="form-section-title">Event Cover</h2>
        <p className="form-section-desc">Upload a banner, flyer, or logo. PNG, JPG or WEBP - max 5 MB.</p>
      </div>

      {preview ? (
        <div className="rounded-lg border border-border overflow-hidden">
          <div className="relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={preview}
              alt="Event cover preview"
              className="w-full h-44 object-cover"
            />
            {uploading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                <Loader2 className="size-6 text-white animate-spin" />
              </div>
            )}
            {!uploading && (
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 size-7"
                onClick={clearFile}
                aria-label="Remove cover image"
              >
                <X className="size-3.5" />
              </Button>
            )}
          </div>
          <p className="px-3 py-2 text-xs text-muted-foreground truncate border-t border-border">
            {uploading ? "Uploading…" : fileName}
          </p>
        </div>
      ) : (
        <label className={`flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border bg-muted/20 px-6 py-10 text-center transition-colors ${uploading ? "cursor-not-allowed opacity-60" : "cursor-pointer hover:bg-primary/5 hover:border-primary/40"}`}>
          <ImageIcon className="size-8 text-muted-foreground" />
          <div>
            <p className="text-sm font-medium">Click to upload</p>
            <p className="text-xs text-muted-foreground mt-0.5">or drag and drop</p>
          </div>
          <input
            ref={inputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className="sr-only"
            disabled={uploading}
            onChange={handleFile}
          />
        </label>
      )}
    </div>
  )
}
