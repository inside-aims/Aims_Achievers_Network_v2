"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { VotingConfig } from "@/components/features/events";

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

  const votingConfig: VotingConfig | null = data
    ? {
        eventDocId: data.eventDocId,
        categoryDocId: data.categoryDocId,
        votingMode: data.votingMode as "standard" | "bulk",
        pricePerVotePesewas: data.pricePerVotePesewas,
        bulkTiers: data.bulkTiers ?? [],
        votingOpen: data.votingOpen,
      }
    : null;

  return {
    category,
    votingConfig,
    nominees: data?.nominees ?? [],
    loading: data === undefined,
    error: null,
  };
}
