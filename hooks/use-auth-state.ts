"use client";

import { useConvexAuth } from "convex/react";

/**
 * Thin wrapper around useConvexAuth.
 * Use this throughout the app instead of importing useConvexAuth directly
 * so that any future changes to the auth state shape only need updating here.
 */
export const useAuthState = () => {
  return useConvexAuth();
};
