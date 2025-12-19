import { CornerSettings } from "@/components/ui/corner-settings";
import { PublicTRPCProvider } from "@/providers/public-trpc-provider";
import type { ReactNode } from "react";

interface PublicLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: PublicLayoutProps) {
  return (
    <PublicTRPCProvider>
      <div className="min-h-screen flex flex-col">
        <main className="min-h-screen flex flex-col justify-center">
          <div>{children}</div>
        </main>
      </div>
      <CornerSettings />
    </PublicTRPCProvider>
  );
}
