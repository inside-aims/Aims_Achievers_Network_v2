"use server";

import { createClient } from "@/lib/supabase/server";
import { Database } from "@/lib/supabase/types_db";
import { unstable_cache } from "next/cache";

export type EventStatus = "all" | "active" | "past";

// Extended types to include runtime fields or future schema updates
export type CategoryWithPrice = Database["public"]["Tables"]["event_categories"]["Row"] & {
  vote_price: number;
};

export type EventWithCategoryCount = Database["public"]["Tables"]["events"]["Row"] & {
  categories: { count: number }[];
};

export async function getEvents({
  query,
  status = "all",
}: {
  query?: string;
  status?: EventStatus;
}) {
  const supabase = await createClient();
  const currentDate = new Date().toISOString();

  let dbQuery = supabase
    .from("events")
    .select("*, categories:event_categories(count)", { count: "exact" });

  if (query) {
    dbQuery = dbQuery.ilike("title", `%${query}%`);
  }

  // Filter based on status logic
  if (status === "active") {
    dbQuery = dbQuery
      .eq("status", "live")
      .lte("voting_starts_at", currentDate)
      .gte("voting_ends_at", currentDate);
  } else if (status === "past") {
    dbQuery = dbQuery.or(`status.eq.closed,voting_ends_at.lt.${currentDate}`);
  } else {
      // By default show live and closed, exclude draft for public listing usually? 
      // User didn't specify, but assuming public listing shows non-drafts.
      dbQuery = dbQuery.neq("status", "draft");
  }
  
  // Order by creation or start date
  dbQuery = dbQuery.order("voting_starts_at", { ascending: false });

  const { data, error } = await dbQuery;

  if (error) {
    console.error("Error fetching events:", error);
    throw new Error("Failed to fetch events");
  }

  // Transform to match potential UI needs (e.g. flattening category count)
  return data?.map((event) => ({
    ...event,
    categoryCount: event.categories?.[0]?.count ?? 0,
  }));
}

export async function getEvent(eventId: string) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from("events")
    .select(`
      *,
      settings:event_settings(*)
    `)
    .eq("id", eventId)
    .single();

  if (error) {
    console.error("Error fetching event:", error);
    return null;
  }

  return data;
}

export async function getEventCategories(eventId: string) {
  const supabase = await createClient();

  // Note: vote_price is mentioned to be added. 
  // We selecting * generally assumes it's there. 
  // If not in DB yet, this might return undefined for that field. 
  
  const { data, error } = await supabase
    .from("event_categories")
    .select("*")
    .eq("event_id", eventId)
    .order("name");

  if (error) {
    console.error("Error fetching categories:", error);
    throw new Error("Failed to fetch categories");
  }

  return data as CategoryWithPrice[];
}

export async function getNominees(categoryId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("nominees")
    .select("*")
    .eq("category_id", categoryId)
    .eq("status", "active") // Only show active nominees
    .order("display_name");

  if (error) {
    console.error("Error fetching nominees:", error);
    throw new Error("Failed to fetch nominees");
  }

  return data;
}

export async function getNominee(nomineeId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("nominees")
    .select(`
      *,
      category:event_categories(*),
      event:events(*)
    `)
    .eq("id", nomineeId)
    .single();

  if (error) {
    console.error("Error fetching nominee:", error);
    return null;
  }

  return data;
}
