"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export function useOutlets() {
  const data = useQuery(api.outlets.listPublic);

  return {
    outlets: data ?? [],
    loading: data === undefined,
    error: null,
  };
}
