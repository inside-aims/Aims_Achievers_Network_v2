"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import type { Outlet } from "@/components/features/outlets/index";

// Fetches all active outlets
export function useOutlets() {
  const [outlets, setOutlets] = useState<Outlet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOutlets = async () => {
      try {
        setLoading(true);
        const { data, error: fetchError } = await supabase
          .from("outlets")
          .select("*")
          .eq("is_active", true)
          .order("featured", { ascending: false });

        if (fetchError) throw fetchError;

        const mapped: Outlet[] = (data || []).map((row) => ({
          id: row.id,
          name: row.name,
          tagline: row.tagline ?? "",
          description: row.description ?? "",
          location: row.location ?? "",
          rating: row.rating ?? 0,
          reviews: row.reviews,
          completedOrders: row.completed_orders,
          specialties: row.specialties,
          phone: row.phone ?? "",
          whatsapp: row.whatsapp ?? "",
          website: row.website ?? undefined,
          portfolioImages: row.portfolio_images,
          featured: row.featured,
          responseTime: row.response_time ?? "",
          yearsExperience: row.years_experience ?? 0,
          clientSatisfaction: row.client_satisfaction ?? 0,
          verified: row.verified,
        }));

        setOutlets(mapped);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch outlets");
      } finally {
        setLoading(false);
      }
    };

    fetchOutlets();
  }, []);

  return { outlets, loading, error };
}
