import { getSupabaseBrowser } from "@/lib/supabase/supabase-browser";
import type { Session, AuthChangeEvent } from "@supabase/supabase-js";
import { useEffect, useMemo, useState } from "react";

export const useAuth = () => {
  const supabase = useMemo(() => getSupabaseBrowser(), []);

  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session ?? null);
      setLoading(false);
    };

    init();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event: AuthChangeEvent, session: Session) => {
        setSession(session ?? null);
      },
    );

    return () => {
      authListener?.subscription?.unsubscribe?.();
    };
  }, [supabase]);

  const token = session?.access_token || null;

  return { session, supabase, loading, token };
};
