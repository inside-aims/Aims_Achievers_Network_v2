"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useMemo } from "react";

export function useGallery() {
  const data = useQuery(api.gallery.listAll);

  const photos = data ?? [];

  const { events, categories, universities } = useMemo(() => {
    const events = ["All Events", ...Array.from(new Set(photos.map((p) => p.eventName).filter(Boolean)))];
    const categories = ["All Categories", ...Array.from(new Set(photos.map((p) => p.category).filter(Boolean)))];
    const universities = ["All Universities", ...Array.from(new Set(photos.map((p) => p.university).filter(Boolean)))];
    return { events, categories, universities };
  }, [photos]);

  return {
    photos,
    events,
    categories,
    universities,
    loading: data === undefined,
    error: null,
  };
}
