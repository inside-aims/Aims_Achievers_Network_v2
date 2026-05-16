"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { ArrowLeft, Download, Archive, User, ImageOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

interface Props {
  profileId: string;
  eventId: string;
  categoryId: string;
}

function sanitizeFilename(name: string): string {
  return name.replace(/[^\w\s.-]/g, "_").trim();
}

function buildImageFilename(shortcode: string, displayName: string): string {
  return sanitizeFilename(`${shortcode}-${displayName}.jpg`);
}

async function downloadSingleImage(url: string, filename: string) {
  const res = await fetch(
    `/api/download/image?url=${encodeURIComponent(url)}&filename=${encodeURIComponent(filename)}`,
  );
  if (!res.ok) throw new Error("Download failed");
  const blob = await res.blob();
  const blobUrl = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = blobUrl;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(blobUrl);
}

async function downloadAllAsZip(
  nominees: { url: string; filename: string }[],
  categoryName: string,
) {
  const res = await fetch("/api/download/nominees-zip", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nominees, categoryName }),
  });
  if (!res.ok) throw new Error("ZIP generation failed");

  const failedCount = Number(res.headers.get("X-Failed-Count") ?? 0);

  const blob = await res.blob();
  const blobUrl = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = blobUrl;
  a.download = `${sanitizeFilename(categoryName)}-nominees.zip`;
  a.click();
  URL.revokeObjectURL(blobUrl);

  if (failedCount > 0) {
    toast.warning(`${failedCount} image${failedCount === 1 ? "" : "s"} could not be downloaded and were excluded from the ZIP.`);
  }
}

// ─── Nominee card ────────────────────────────────────────────────────────────

interface NomineeCardProps {
  displayName: string;
  shortcode: string;
  avatarUrl?: string;
}

function NomineeCard({ displayName, shortcode, avatarUrl }: NomineeCardProps) {
  const [downloading, setDownloading] = useState(false);
  const hasImage = Boolean(avatarUrl);

  async function handleDownload() {
    if (!avatarUrl) return;
    setDownloading(true);
    try {
      await downloadSingleImage(avatarUrl, buildImageFilename(shortcode, displayName));
    } catch {
      toast.error("Failed to download image");
    } finally {
      setDownloading(false);
    }
  }

  return (
    <div className="group flex flex-col overflow-hidden rounded-xl border bg-card shadow-sm">
      <div className="relative h-44 w-full bg-muted">
        {hasImage ? (
          <Image
            src={avatarUrl!}
            alt={displayName}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            unoptimized
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <User className="size-10 text-muted-foreground/40" />
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-3">
        <div className="space-y-1">
          <p className="truncate text-sm font-semibold leading-tight">{displayName}</p>
          <Badge variant="outline" className="text-[10px] font-mono px-1.5">
            {shortcode}
          </Badge>
        </div>

        <Button
          variant="outline"
          size="sm"
          disabled={!hasImage || downloading}
          onClick={handleDownload}
          className="mt-auto gap-1.5"
        >
          {hasImage ? (
            <>
              <Download className="size-3.5" />
              {downloading ? "Downloading…" : "Download"}
            </>
          ) : (
            <>
              <ImageOff className="size-3.5" />
              No image
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

// ─── Skeleton ────────────────────────────────────────────────────────────────

function GridSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex flex-col overflow-hidden rounded-xl border bg-card">
          <Skeleton className="h-44 w-full rounded-none" />
          <div className="space-y-2 p-3">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-8 w-full mt-1" />
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Main component ──────────────────────────────────────────────────────────

export function CategoryNominees({ profileId, eventId, categoryId }: Props) {
  const [zipDownloading, setZipDownloading] = useState(false);

  const result = useQuery(api.categories.getWithNomineesForOrganizer, {
    eventId: eventId as Id<"events">,
    categoryId: categoryId as Id<"categories">,
  });

  const backHref = `/user/${profileId}/events/${eventId}`;
  const isLoading = result === undefined;
  const category = result?.category ?? null;
  const nominees = result?.nominees ?? [];

  const activeNominees = nominees.filter((n) => n.status === "active");
  const withImages = activeNominees.filter((n) => n.avatarUrl);

  async function handleDownloadAll() {
    if (withImages.length === 0) return;
    setZipDownloading(true);
    try {
      const entries = withImages.map((n) => ({
        url: n.avatarUrl!,
        filename: buildImageFilename(n.shortcode, n.displayName),
      }));
      await downloadAllAsZip(entries, category?.name ?? "nominees");
    } catch {
      toast.error("Failed to generate ZIP");
    } finally {
      setZipDownloading(false);
    }
  }

  return (
    <div className="space-y-4 md:space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <Button asChild variant="outline" size="sm" className="shrink-0">
            <Link href={backHref}>
              <ArrowLeft className="size-4" />
              <span className="hidden sm:inline">Back</span>
            </Link>
          </Button>
          <div className="min-w-0">
            {isLoading ? (
              <Skeleton className="h-5 w-40" />
            ) : (
              <h1 className="truncate text-base font-semibold md:text-lg">
                {category?.name ?? "Category"}
              </h1>
            )}
            <p className="text-xs text-muted-foreground">Nominee images</p>
          </div>
        </div>

        <Button
          onClick={handleDownloadAll}
          disabled={isLoading || withImages.length === 0 || zipDownloading}
          size="sm"
          className="shrink-0 gap-1.5"
        >
          <Archive className="size-4" />
          {zipDownloading ? "Building ZIP…" : `Download All (${withImages.length})`}
        </Button>
      </div>

      {/* Grid */}
      <Card>
        <CardHeader className="pb-0 px-4 md:px-6">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm md:text-base">Nominees</CardTitle>
            {!isLoading && (
              <span className="text-xs text-muted-foreground tabular-nums">
                {withImages.length} of {activeNominees.length} have images
              </span>
            )}
          </div>
        </CardHeader>

        <CardContent className="pt-4 px-4 md:px-6">
          {isLoading ? (
            <GridSkeleton />
          ) : activeNominees.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
              <User className="size-10 text-muted-foreground/40" />
              <p className="text-sm font-medium">No nominees yet</p>
              <p className="text-xs text-muted-foreground">
                Approved nominees will appear here.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {activeNominees.map((nominee) => (
                <NomineeCard
                  key={nominee._id}
                  displayName={nominee.displayName}
                  shortcode={nominee.shortcode}
                  avatarUrl={nominee.avatarUrl}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
