"use client";

import { trpc } from "@/lib/trpc/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { createBrowserClient } from "@supabase/auth-helpers-react";
import { httpBatchLink, loggerLink } from "@trpc/client";
import type { Session } from "@supabase/supabase-js";

type ProtectedTRPCContextType = {
  session: Session | null;
  supabaseClient: ReturnType<typeof createBrowserClient>;
};

const ProtectedTRPCContext = createContext<
  ProtectedTRPCContextType | undefined
>(undefined);

export const useProtectedTRPC = () => {
  const ctx = useContext(ProtectedTRPCContext);
  if (!ctx)
    throw new Error(
      "useProtectedTRPC must be used inside ProtectedTRPCProvider",
    );
  return ctx;
};

export const ProtectedTRPCProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const queryClientRef = useRef<QueryClient | null>(null);
  const trpcClientRef = useRef<ReturnType<typeof trpc.createClient> | null>(
    null,
  );

  const [supabaseClient] = useState(() =>
    createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    ),
  );

  const [session, setSession] = useState<Session | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    supabaseClient.auth.getSession().then(({ data }) => {
      setSession(data.session ?? null);
      setToken(data.session?.access_token ?? null);
    });

    const {
      data: { subscription },
    } = supabaseClient.auth.onAuthStateChange((_, session) => {
      setSession(session ?? null);
      setToken(session?.access_token ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabaseClient]);

  if (!queryClientRef.current) {
    queryClientRef.current = new QueryClient({
      defaultOptions: { queries: { staleTime: 1000 * 60, retry: 1 } },
    });
  }

  if (!trpcClientRef.current) {
    trpcClientRef.current = trpc.createClient({
      links: [
        loggerLink({
          enabled: (_opts) => process.env.NODE_ENV === "development",
        }),
        httpBatchLink({
          url: "/trpc",
          fetch: (input, init) => {
            const headers = new Headers(init?.headers);
            if (token) headers.set("Authorization", `Bearer ${token}`);
            return fetch(input, { ...init, headers });
          },
        }),
      ],
    });
  }

  return (
    <ProtectedTRPCContext.Provider value={{ session, supabaseClient }}>
      <trpc.Provider
        client={trpcClientRef.current}
        queryClient={queryClientRef.current}
      >
        <QueryClientProvider client={queryClientRef.current}>
          {children}
        </QueryClientProvider>
      </trpc.Provider>
    </ProtectedTRPCContext.Provider>
  );
};
