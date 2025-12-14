import type { ReactNode } from "react";
import { Sidebar, SidebarInset, SidebarProvider } from "@mep/ui";
import { Header } from "@/components/ui/public/header";

interface PublicLayoutProps {
  children: ReactNode;
}

export default function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <SidebarProvider>
      <div className="md:hidden">
        <Sidebar />
      </div>
      <SidebarInset className="overflow-y-hidden">
        <Header />
        <div className="flex flex-1 flex-col gap-4 pt-4 overflow-y-hidden">
          <div className="mb-5 pt-5">{children}</div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
