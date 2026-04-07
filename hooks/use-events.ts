"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export function useEvents() {
  const data = useQuery(api.events.listPublicWithCategories);

  return {
    events: data ?? [],
    loading: data === undefined,
    error: null,
  };
}
