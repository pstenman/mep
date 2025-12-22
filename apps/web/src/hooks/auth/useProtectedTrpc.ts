import { trpc } from "@/lib/trpc/client";
import { QueryClient } from "@tanstack/react-query";
import { httpBatchLink, loggerLink } from "@trpc/react-query";
import { useRef, useEffect } from "react";

export const useProtectedTRPC = (token: string | null) => {
  const queryClientRef = useRef<QueryClient | null>(null);
  const trpcClientRef = useRef<ReturnType<typeof trpc.createClient> | null>(
    null,
  );
  const tokenRef = useRef<string | null>(token);

  useEffect(() => {
    tokenRef.current = token;
  }, [token]);

  if (!queryClientRef.current) {
    queryClientRef.current = new QueryClient({
      defaultOptions: {
        queries: { staleTime: 1000 * 60, retry: 1 },
      },
    });
  }

  if (!trpcClientRef.current) {
    trpcClientRef.current = trpc.createClient({
      links: [
        loggerLink({
          enabled: () => process.env.NODE_ENV === "development",
        }),
        httpBatchLink({
          url: process.env.NEXT_PUBLIC_API_URL
            ? `${process.env.NEXT_PUBLIC_API_URL}/trpc`
            : "/trpc",
          fetch: (input, init) => {
            const headers = new Headers(init?.headers);
            const currentToken = tokenRef.current;

            if (currentToken) {
              headers.set("Authorization", `Bearer ${currentToken}`);
            }

            return fetch(input, { ...init, headers });
          },
        }),
      ],
    });
  }

  return {
    queryClient: queryClientRef.current,
    trpcClient: trpcClientRef.current,
  };
};
