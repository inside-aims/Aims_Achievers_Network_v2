"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useGallery } from "@/hooks/use-gallery";

export default function GalleryPreview() {
  const { photos, loading } = useGallery();
  const preview = photos.slice(0, 6);

  if (!loading && preview.length === 0) return null;

  return (
    <section className="bg-background text-foreground feature-no py-20 md:py-28">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12 md:mb-16">
        <div>
          <span className="text-xs tracking-[0.25em] font-mono text-muted-foreground">
            FROM PAST EVENTS
          </span>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-light font-serif tracking-tight leading-[1.0] mt-4">
            See what you&apos;d
            <br />
            <span className="text-muted-foreground/60">actually be part of.</span>
          </h2>
        </div>
        <Link
          href="/gallery"
          className="group flex items-center gap-2 text-sm font-mono tracking-[0.2em] text-muted-foreground hover:text-foreground transition-colors duration-300 shrink-0 pb-1"
        >
          FULL GALLERY
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="aspect-square bg-muted animate-pulse rounded-sm" />
            ))
          : preview.map((photo) => (
              <Link
                key={photo.id}
                href="/gallery"
                className="group relative aspect-square overflow-hidden rounded-sm"
              >
                <Image
                  fill
                  src={photo.url[0]}
                  alt={photo.description || photo.eventName}
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 300px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <span className="absolute bottom-3 left-3 text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity duration-500 tracking-wide">
                  {photo.eventName}
                </span>
              </Link>
            ))}
      </div>
    </section>
  );
}
