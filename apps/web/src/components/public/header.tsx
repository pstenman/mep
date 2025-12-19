"use client";

import { Button, SidebarTrigger } from "@mep/ui";
import { LogIn } from "lucide-react";
import Link from "next/link";
import { DesktopNavigation } from "./desktop-navigation";

export function Header() {
  return (
    <div className="h-[70] flex justify-between w-full items-center relative px-4">
      <div className="flex w-0 md:hidden items-center">
        <SidebarTrigger className="p-2" />
      </div>
      <Button
        asChild
        variant="ghost"
        className="text-lg font-bold text-foreground"
      >
        <Link href="/">MeP</Link>
      </Button>

      <div className="hidden md:flex flex-1 justify-center">
        <DesktopNavigation />
      </div>

      {/* Todo: Add tooltip */}
      <div className="hidden md:flex items-center space-x-4">
        <Link href="/login">
          <LogIn />
        </Link>
      </div>

      {/* Todo: Add tooltip */}
      <div className="md:hidden">
        <Button asChild size="sm" variant="ghost">
          <Link href="/login">
            <LogIn />
          </Link>
        </Button>
      </div>
      <div className="absolute bottom-0 left-4 right-4 border-t border-gray-200 dark:border-gray-700"></div>
    </div>
  );
}
