"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import type { EventCategory, NomineeProps } from "@/components/features/events";

interface CategoryWithNominees extends EventCategory {
  eventId: string;
  eventTitle: string;
  eventEndDate: string;
}

// Fetches a single category with all its nominees
export function useCategoryNominees(eventId: string, categoryId: string) {
  const [category, setCategory] = useState<CategoryWithNominees | null>(null);
  const [nominees, setNominees] = useState<NomineeProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!eventId || !categoryId) return;

    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch category + event info in one query
        const { data: rawCatData, error: catError } = await supabase
          .from("event_categories")
          .select(`
            *,
            events (
              title,
              end_date
            )
          `)
          .eq("category_id", categoryId)
          .eq("event_id", eventId)
          .single();

        if (catError) throw catError;
        if (!rawCatData) throw new Error("Category not found");

        const catData = rawCatData as unknown as {
          category_id: string;
          name: string;
          description: string | null;
          vote_price: number;
          events: { title: string; end_date: string } | null;
        };

        const eventInfo = catData.events;

        setCategory({
          id: catData.category_id,
          name: catData.name,
          description: catData.description ?? "",
          votePrice: catData.vote_price,
          eventId,
          eventTitle: eventInfo?.title ?? "",
          eventEndDate: eventInfo?.end_date ?? "",
        });

        // Fetch nominees for this category
        const { data: rawNomData, error: nomError } = await supabase
          .from("nominees")
          .select("*")
          .eq("category_id", categoryId)
          .eq("event_id", eventId)
          .eq("is_active", true)
          .order("votes", { ascending: false });

        if (nomError) throw nomError;

        type NomineeRow = {
          nominee_id: string;
          nominee_code: string | null;
          full_name: string;
          description: string | null;
          image_url: string | null;
          votes: number;
        };

        const mappedNominees: NomineeProps[] = ((rawNomData as unknown as NomineeRow[]) || []).map((n) => ({
          nomineeId: n.nominee_id,
          nomineeCode: n.nominee_code ?? n.nominee_id,
          fullName: n.full_name,
          description: n.description ?? "",
          imageUrl: n.image_url ?? "https://randomuser.me/api/portraits/men/1.jpg",
          votes: n.votes,
        }));

        setNominees(mappedNominees);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch nominees");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [eventId, categoryId]);

  return { category, nominees, loading, error };
}
