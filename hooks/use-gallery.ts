"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import type { PhotoProps } from "@/components/features/gallery";

// Fetches all gallery photos
export function useGallery() {
  const [photos, setPhotos] = useState<PhotoProps[]>([]);
  const [events, setEvents] = useState<string[]>(["All Events"]);
  const [categories, setCategories] = useState<string[]>(["All Categories"]);
  const [universities, setUniversities] = useState<string[]>(["All Universities"]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        setLoading(true);
        const { data, error: fetchError } = await supabase
          .from("gallery")
          .select("*")
          .order("upload_date", { ascending: false });

        if (fetchError) throw fetchError;

        const mapped: PhotoProps[] = (data || []).map((row) => ({
          id: row.id,
          url: row.urls,
          category: row.category,
          eventName: row.event_name,
          university: row.university ?? "",
          description: row.description,
          photographer: row.photographer ?? "",
          uploadDate: row.upload_date,
        }));

        setPhotos(mapped);

        // Build filter options from data
        const uniqueEvents = ["All Events", ...Array.from(new Set(mapped.map((p) => p.eventName).filter(Boolean)))];
        const uniqueCategories = ["All Categories", ...Array.from(new Set(mapped.map((p) => p.category).filter(Boolean)))];
        const uniqueUniversities = ["All Universities", ...Array.from(new Set(mapped.map((p) => p.university).filter(Boolean)))];

        setEvents(uniqueEvents);
        setCategories(uniqueCategories);
        setUniversities(uniqueUniversities);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch gallery");
      } finally {
        setLoading(false);
      }
    };

    fetchPhotos();
  }, []);

  return { photos, events, categories, universities, loading, error };
}
