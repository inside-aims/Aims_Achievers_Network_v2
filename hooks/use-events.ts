"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import type { EventCardProps, EventCategory } from "@/components/features/events/index";

// Fetches all active events with their categories (for listing + nominations)
export function useEvents() {
  const [events, setEvents] = useState<EventCardProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const { data: rawData, error: fetchError } = await supabase
          .from("events")
          .select(`
            *,
            event_categories (
              category_id,
              name,
              description,
              vote_price,
              is_active
            )
          `)
          .eq("is_active", true)
          .order("created_at", { ascending: false });

        if (fetchError) throw fetchError;

        type EventRow = {
          event_id: string;
          title: string;
          description: string | null;
          image: string | null;
          start_date: string;
          end_date: string;
          event_categories: { category_id: string; name: string; description: string | null; vote_price: number }[];
        };

        const mapped: EventCardProps[] = ((rawData as unknown as EventRow[]) || []).map((row) => ({
          eventId: row.event_id,
          title: row.title,
          description: row.description ?? "",
          image: row.image ?? "",
          startDate: row.start_date,
          endDate: row.end_date,
          categories: (row.event_categories || []).map((cat) => ({
            id: cat.category_id,
            name: cat.name,
            description: cat.description ?? "",
            votePrice: cat.vote_price,
          })),
        }));

        setEvents(mapped);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch events");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return { events, loading, error };
}
