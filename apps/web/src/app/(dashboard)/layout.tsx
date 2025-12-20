"use client";

import { DashboardHeader } from "@/components/dashboard/header";
import { DashboardSidebar } from "@/components/dashboard/siderbar";
import { CornerSettings } from "@/components/ui/corner-settings";
import { useProtectedRoute } from "@/hooks/auth/useProtectedRoute";
import {
  ProtectedTRPCProvider,
  useProtectedTRPC,
} from "@/providers/protected-trpc-provider";
import { SidebarInset, SidebarProvider } from "@mep/ui";
import { Loader2 } from "lucide-react";
import type { ReactNode } from "react";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <ProtectedTRPCProvider>
      <InnerDashboardLayout>{children}</InnerDashboardLayout>
    </ProtectedTRPCProvider>
  );
}

function InnerDashboardLayout({ children }: { children: ReactNode }) {
  const { session } = useProtectedTRPC();
  const { ready } = useProtectedRoute(session);

  if (!ready) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 />
      </div>
    );
  }

  return (
    <SidebarProvider>
      <DashboardSidebar />
      <SidebarInset className="overflow-y-hidden">
        <DashboardHeader />

        <div className="flex flex-1 flex-col gap-4 pt-4 overflow-y-hidden">
          <div className="mb-5 pt-5">{children}</div>
        </div>
        <CornerSettings />
      </SidebarInset>
    </SidebarProvider>
  );
}
