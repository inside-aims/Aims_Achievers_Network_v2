"use client";

import { useEffect } from "react";
import { useRouter, usePathname, useParams } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import ChangePasswordForm from "@/components/features/auth/ChangePasswordForm";

/**
 * Runs inside the dashboard layout on every route.
 *
 * Responsibilities:
 * 1. Redirects unauthenticated users to /login (fallback behind proxy.ts).
 * 2. Corrects UUID mismatches — prevents a user from accessing another
 *    user's dashboard by typing a different UUID in the URL.
 * 3. Corrects role mismatches — prevents an organizer from reaching /admin/*
 *    and an admin from landing on /user/*.
 * 4. Forces password change — shows an undismissable overlay for any account
 *    still on its default password.
 */
export function DashboardGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();

  const urlProfileId = params?.profileId as string | undefined;
  const isAdminRoute = pathname.startsWith("/admin/");

  const profile = useQuery(api.users.getMyProfile);

  useEffect(() => {
    if (profile === undefined) return; // still loading

    if (profile === null) {
      // No authenticated profile — proxy.ts should have caught this, but
      // handle it here as a safety net.
      router.replace("/login");
      return;
    }

    // ── Profile ID ownership check ─────────────────────────────────────────
    // If the profileId in the URL does not match the authenticated user's
    // organizerProfiles._id, redirect them to their own dashboard.
    if (urlProfileId && profile._id !== urlProfileId) {
      const prefix = profile.role === "admin" ? "admin" : "user";
      router.replace(`/${prefix}/${profile._id}`);
      return;
    }

    // ── Role / route-prefix check ──────────────────────────────────────────
    // An organizer must not access /admin/* and an admin must not land on
    // /user/* — redirect each to their correct prefix.
    if (isAdminRoute && profile.role !== "admin") {
      router.replace(`/user/${profile._id}`);
      return;
    }

    if (!isAdminRoute && profile.role === "admin") {
      router.replace(`/admin/${profile._id}`);
      return;
    }
  }, [profile, urlProfileId, isAdminRoute, router]);

  // ── Loading state ────────────────────────────────────────────────────────
  if (profile === undefined) {
    return (
      <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">
        <span className="size-5 border-2 border-muted border-t-foreground/40 rounded-full animate-spin" />
      </div>
    );
  }

  // Redirecting — render nothing while navigation completes
  if (profile === null) return null;

  // ── Force password change ────────────────────────────────────────────────
  // Renders children underneath the overlay so the sidebar/layout remain
  // mounted, but the fixed inset overlay prevents any interaction.
  if (profile.isPasswordDefault) {
    return (
      <>
        {children}
        <ChangePasswordForm displayName={profile.displayName} />
      </>
    );
  }

  return <>{children}</>;
}
