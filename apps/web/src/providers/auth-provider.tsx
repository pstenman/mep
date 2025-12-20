import { useAuth } from "@/hooks/auth/useAuth";
import { useProtectedTRPC } from "@/hooks/auth/useProtectedTrpc";
import { trpc } from "@/lib/trpc/client";
import { QueryClientProvider } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";

interface AuthProviderProps {
  children: ReactNode;
  redirectTo?: string;
}

export const AuthProvider = ({
  children,
  redirectTo = "/login",
}: AuthProviderProps) => {
  const router = useRouter();
  const { session, token, loading } = useAuth();
  const { queryClient, trpcClient } = useProtectedTRPC(token);

  useEffect(() => {
    if (!loading && !session) {
      router.replace(redirectTo);
    }
  }, [loading, session, router, redirectTo]);

  if (loading || !session) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  if (!session) {
    router.replace(redirectTo);
    return null;
  }

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  );
};
