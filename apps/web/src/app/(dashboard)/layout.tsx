import { DashboardHeader } from "@/components/dashboard/header";
import { DashboardSidebar } from "@/components/dashboard/siderbar";
import { CornerSettings } from "@/components/ui/corner-settings";
import { SidebarInset, SidebarProvider } from "@mep/ui";
import type { ReactNode } from "react";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <SidebarProvider>
      <DashboardSidebar />
      <SidebarInset className="overflow-y-hiden">
        <DashboardHeader />

        <div className="flex flex-1 flex-col gap-4 pt-4 overflow-y-hidden">
          <div className="mb-5 pt-5">{children}</div>
        </div>
        <CornerSettings />
      </SidebarInset>
    </SidebarProvider>
  );
}
