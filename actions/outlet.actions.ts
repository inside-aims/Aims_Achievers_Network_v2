"use server";

import { createClient } from "@/lib/supabase/server";

export async function getOutlets() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("outlets")
    .select("*")
    .order("name");

  if (error) {
    console.error("Error fetching outlets:", error);
    throw new Error("Failed to fetch outlets");
  }

  return data;
}

export async function getOutlet(id: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("outlets")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching outlet:", error);
    return null;
  }

  return data;
}
