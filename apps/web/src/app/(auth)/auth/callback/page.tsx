"use client";

import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { handleMagicLinkCallback } from "@/lib/supabase/handle-link";
import { useRouter } from "next/navigation";

export default function AuthCallbackPage() {
  const router = useRouter();
  useEffect(() => {
    handleMagicLinkCallback(router);
  }, []);

  return (
    <div className="flex h-screen items-center justify-center">
      <Loader2 className="animate-spin" />
    </div>
  );
}
