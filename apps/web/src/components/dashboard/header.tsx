"use client";

import { SidebarTrigger } from "@mep/ui";

export function DashboardHeader() {
  return (
    <div className="h-[70] flex justify-between w-full items-center relative px-4 ">
      <div className="flex items-center space-x-2">
        <SidebarTrigger />
        {/* TODO: Add breadcrumb for group navigation */}
      </div>
      <div></div>
      <div className="absolute bottom-0 left-4 right-4 border-t border-gray-200 dark:border-gray-700"></div>
    </div>
  );
}
