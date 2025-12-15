import type { ReactNode } from "react";
import { SidebarInset, SidebarProvider } from "@mep/ui";
import { Header } from "@/components/ui/public/header";
import { CornerSettings } from "@/components/ui/public/corner-settings";
import { PublicSidebar } from "@/components/ui/public/sidebar";
import { PublicTRPCProvider } from "@/providers/public-trpc-provider";

interface PublicLayoutProps {
  children: ReactNode;
}

export default function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <PublicTRPCProvider>
      <SidebarProvider>
        <div className="md:hidden">
          <PublicSidebar />
        </div>
        <SidebarInset className="overflow-y-hidden">
          <Header />
          <div className="flex flex-1 flex-col gap-4 pt-4 overflow-y-hidden">
            <div className="mb-5 pt-5">{children}</div>
          </div>
          <CornerSettings />
        </SidebarInset>
      </SidebarProvider>
    </PublicTRPCProvider>
  );
}
