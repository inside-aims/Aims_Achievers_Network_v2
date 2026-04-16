"use client";

import { cn } from "@/lib/utils";

// ─── Base skeleton block ──────────────────────────────────────────────────────
export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("skeleton", className)} {...props} />;
}

// ─── Event card skeleton ──────────────────────────────────────────────────────
export function EventCardSkeleton() {
  return (
    <div className="rounded-card border border-primary/10 bg-card overflow-hidden">
      <Skeleton className="h-48 w-full rounded-none" />
      <div className="flex flex-col gap-3 p-4">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <div className="flex items-center justify-between gap-4">
          <Skeleton className="h-7 w-28 rounded-card" />
          <Skeleton className="h-7 w-28 rounded-card" />
        </div>
        <Skeleton className="h-9 w-full rounded-md mt-1" />
      </div>
    </div>
  );
}

// ─── Category card skeleton ───────────────────────────────────────────────────
export function CategoryCardSkeleton() {
  return (
    <div className="flex flex-col gap-4 rounded-card bg-card p-4 border border-primary/10">
      <div className="flex items-center justify-between">
        <Skeleton className="h-10 w-10 rounded-lg" />
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
      <Skeleton className="h-4 w-1/3" />
      <Skeleton className="h-9 w-full rounded-md" />
    </div>
  );
}

// ─── Nominee card skeleton ────────────────────────────────────────────────────
export function NomineeCardSkeleton() {
  return (
    <div className="rounded-card border bg-card border-primary/10 overflow-hidden">
      <Skeleton className="h-44 w-full rounded-none" />
      <div className="flex flex-col gap-3 p-4">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-1/3" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-10 flex-1 rounded-md" />
          <Skeleton className="h-10 w-10 rounded-md" />
        </div>
      </div>
    </div>
  );
}

// ─── Gallery item skeleton ────────────────────────────────────────────────────
export function GalleryItemSkeleton() {
  return (
    <div className="rounded-card overflow-hidden">
      <Skeleton className="aspect-square w-full rounded-none" />
      <div className="p-3 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
  );
}

// ─── Outlet card skeleton ─────────────────────────────────────────────────────
export function OutletCardSkeleton() {
  return (
    <div className="rounded-card border border-primary/10 bg-card overflow-hidden">
      <div className="flex flex-col md:flex-row gap-0">
        <Skeleton className="h-52 md:h-auto md:w-72 rounded-none" />
        <div className="flex flex-col gap-4 p-6 flex-1">
          <div className="flex items-start justify-between">
            <div className="space-y-2 flex-1">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-64" />
            </div>
            <Skeleton className="h-6 w-16 rounded-full" />
          </div>
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <div className="flex gap-2 flex-wrap">
            <Skeleton className="h-6 w-24 rounded-full" />
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-28 rounded-full" />
          </div>
          <div className="flex items-center gap-3 mt-auto">
            <Skeleton className="h-10 w-32 rounded-md" />
            <Skeleton className="h-10 w-32 rounded-md" />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Home event card skeleton (minimal) ──────────────────────────────────────
export function HomeEventCardSkeleton() {
  return (
    <div className="rounded-lg overflow-hidden border border-border/50">
      <Skeleton className="aspect-video w-full rounded-none" />
      <div className="p-4 space-y-2">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    </div>
  );
}
