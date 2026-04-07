"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

// eventId = event slug, categoryId = categoryCode (both are URL-friendly identifiers)
export function useCategoryNominees(eventId: string, categoryId: string) {
  const data = useQuery(
    api.categories.getByCodeWithNominees,
    eventId && categoryId
      ? { eventSlug: eventId, categoryCode: categoryId }
      : "skip",
  );

  const category = data
    ? {
        id: data.id,
        name: data.name,
        description: data.description,
        votePrice: data.votePrice,
        eventId: data.eventId,
        eventTitle: data.eventTitle,
        eventEndDate: data.eventEndDate,
      }
    : null;

  return {
    category,
    nominees: data?.nominees ?? [],
    loading: data === undefined,
    error: null,
  };
}
