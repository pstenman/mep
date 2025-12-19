import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let supabase: SupabaseClient | null = null;

export const getSupabase = () => {
  if (supabase) return supabase;

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error("Supabase env vars are missing");
  }

  supabase = createClient(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  return supabase;
};