"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import type { EventCardProps } from "@/components/features/events";

// Fetches a single event with all its categories
export function useEvent(eventId: string) {
  const [event, setEvent] = useState<EventCardProps | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!eventId) return;

    const fetchEvent = async () => {
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
          .eq("event_id", eventId)
          .single();

        if (fetchError) throw fetchError;
        if (!rawData) throw new Error("Event not found");

        type EventRow = {
          event_id: string;
          title: string;
          description: string | null;
          image: string | null;
          start_date: string;
          end_date: string;
          event_categories: { category_id: string; name: string; description: string | null; vote_price: number }[];
        };

        const data = rawData as unknown as EventRow;

        const mapped: EventCardProps = {
          eventId: data.event_id,
          title: data.title,
          description: data.description ?? "",
          image: data.image ?? "",
          startDate: data.start_date,
          endDate: data.end_date,
          categories: (data.event_categories || []).map((cat) => ({
            id: cat.category_id,
            name: cat.name,
            description: cat.description ?? "",
            votePrice: cat.vote_price,
          })),
        };

        setEvent(mapped);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch event");
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId]);

  return { event, loading, error };
}
