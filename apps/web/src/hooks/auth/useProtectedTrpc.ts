import { trpc } from "@/lib/trpc/client";
import { QueryClient } from "@tanstack/react-query";
import { httpBatchLink, loggerLink } from "@trpc/react-query";
import { useRef } from "react";

export const useProtectedTRPC = (token: string | null) => {
  const queryClientRef = useRef<QueryClient | null>(null);
  const trpcClientRef = useRef<ReturnType<typeof trpc.createClient> | null>(
    null,
  );

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
          url: "/trpc",
          fetch: (input, init) => {
            const headers = new Headers(init?.headers);
            if (token) {
              headers.set("Authorization", `Bearer ${token}`);
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
