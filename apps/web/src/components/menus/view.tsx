"use client";

import { useState } from "react";
import type { GroupKey } from "@/lib/navigation/dashboard/types";
import { trpc } from "@/lib/trpc/client";
import { urlGroupToMenuTypeFilter } from "@/utils/filters/url-to-api-filters";
import { Loader2 } from "lucide-react";
import { EmptyState } from "./empty-state";
import { MenusSheet } from "./sheet";
import { ActiveMenuView } from "./active-view";
import { MenusTableView } from "./menus-table-view";
import type { MenuType } from "@mep/types";

interface MenusViewProps {
  group: GroupKey | "all";
}

type ViewMode = "active" | "table";

export function MenusView({ group }: MenusViewProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("active");
  const menuTypeFilter = urlGroupToMenuTypeFilter(group);

  const { data, isLoading } = trpc.menus.getAll.useQuery({
    filter: menuTypeFilter ? { menuType: menuTypeFilter } : undefined,
  });

  if (isLoading) {
    return (
      <div className="flex w-full justify-center">
        <div className="w-full px-3 py-4 md:px-6 lg:px-8 max-w-full lg:max-w-[794px]">
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
        </div>
      </div>
    );
  }

  const menus = data?.data?.items ?? data?.data ?? [];

  const hasMenus = menus.length > 0;

  const handleTableClick = () => {
    setViewMode("table");
  };

  const handleBackClick = () => {
    setViewMode("active");
  };

  return (
    <>
      <div className="flex w-full justify-center">
        <div className="w-full px-3 py-4 md:px-6 lg:px-8 max-w-full lg:max-w-[794px]">
          {hasMenus ? (
            viewMode === "active" ? (
              <ActiveMenuView
                menuType={menuTypeFilter as MenuType | null}
                onTableClick={handleTableClick}
              />
            ) : (
              <MenusTableView type={group} onBackClick={handleBackClick} />
            )
          ) : (
            <EmptyState group={group} />
          )}
        </div>
      </div>
      <MenusSheet />
    </>
  );
}
