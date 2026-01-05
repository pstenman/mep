"use client";

import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink, loggerLink } from "@trpc/client";
import { trpc } from "../lib/trpc/client";

export const PublicTRPCProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const queryClientRef = React.useRef<QueryClient | null>(null);
  const trpcClientRef = React.useRef<ReturnType<
    typeof trpc.createClient
  > | null>(null);

  if (!queryClientRef.current) {
    queryClientRef.current = new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 1000 * 60,
          retry: 1,
        },
      },
    });
  }

  if (!trpcClientRef.current) {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL
      ? `${process.env.NEXT_PUBLIC_API_URL}/trpc`
      : "/trpc";

    if (typeof window !== "undefined") {
      console.log("🔍 tRPC API URL:", apiUrl);
      console.log("🔍 NEXT_PUBLIC_API_URL:", process.env.NEXT_PUBLIC_API_URL);
    }

    trpcClientRef.current = trpc.createClient({
      links: [
        loggerLink({
          enabled: (opts) =>
            process.env.NODE_ENV === "development" ||
            (opts.direction === "down" && opts.result instanceof Error),
        }),
        httpBatchLink({
          url: apiUrl,
        }),
      ],
    });
  }

  return (
    <trpc.Provider
      client={trpcClientRef.current}
      queryClient={queryClientRef.current}
    >
      <QueryClientProvider client={queryClientRef.current}>
        {children}
      </QueryClientProvider>
    </trpc.Provider>
  );
};
