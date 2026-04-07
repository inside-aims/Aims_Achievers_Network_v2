"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

// eventId here is the event slug (URL-friendly identifier)
export function useEvent(eventId: string) {
  const data = useQuery(
    api.events.getBySlugWithCategories,
    eventId ? { slug: eventId } : "skip",
  );

  return {
    event: data ?? null,
    loading: data === undefined,
    error: null,
  };
}
