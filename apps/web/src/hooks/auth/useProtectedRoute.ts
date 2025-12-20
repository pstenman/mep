import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";

export function useProtectedRoute(session: Session | null) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (session === null) {
      router.replace("/login");
      return;
    }

    if (session) {
      setReady(true);
    }
  }, [session, router]);

  return { ready };
}
