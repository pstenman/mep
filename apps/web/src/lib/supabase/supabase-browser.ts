import { createBrowserClient } from "@supabase/auth-helpers-react";

let supabase: ReturnType<typeof createBrowserClient> | null = null;

export const getSupabaseBrowser = () => {
  if (!supabase) {
    supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );
  }

  return supabase;
};
