"use client";

import type { GroupKey } from "@/lib/navigation/dashboard/types";
import { trpc } from "@/lib/trpc/client";
import { urlGroupToMenuTypeFilter } from "@/utils/filters/url-to-api-filters";
import { Loader2 } from "lucide-react";
import { AllergiesTableOne } from "./tables";
import { AllergiesEmptyState } from "./empty-state";
import { useState, useEffect } from "react";
import { MenuCombobox } from "../menus/autocomplete";
import { toast } from "sonner";
import { useMenuItemsWithAllergies } from "@/hooks/allegeries/use-menu-allergies";

interface AllergiesViewProps {
  group: GroupKey | "all";
}

export function AllergiesView({ group }: AllergiesViewProps) {
  const menuTypeFilter = urlGroupToMenuTypeFilter(group);
  const [selectedMenuId, setSelectedMenuId] = useState<string | null>(null);

  const { data: menusData, isLoading: isLoadingMenus } =
    trpc.menus.getAll.useQuery({
      filter: menuTypeFilter ? { menuType: menuTypeFilter } : undefined,
    });

  const menus = menusData?.data?.items ?? menusData?.data ?? [];

  const menuId = selectedMenuId ?? menus[0]?.id;

  const { menuItems, allAllergies } = useMenuItemsWithAllergies(menuId);

  useEffect(() => {
    if (!selectedMenuId && menus.length > 0) {
      setSelectedMenuId(menus[0].id);
    }
  }, [menus, selectedMenuId]);

  const handleEditMenuItem = (_menuItemId: string) => {
    // TODO: Implement menu item edit functionality
    toast.info("Edit menu item functionality not yet implemented");
  };

  const handleDeleteMenuItem = (_menuItemId: string) => {
    // TODO: Implement menu item delete functionality
    toast.info("Delete menu item functionality not yet implemented");
  };

  if (isLoadingMenus) {
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

  const hasMenus = menus.length > 0;

  return (
    <div className="flex w-full justify-center">
      <div className="w-full px-3 py-0 md:px-6 lg:px-8 max-w-full lg:max-w-[1400px]">
        {hasMenus ? (
          <>
            <div className="mb-4">
              <MenuCombobox
                menus={menus}
                value={selectedMenuId || undefined}
                onChange={(value) => setSelectedMenuId(value)}
              />
            </div>
            {selectedMenuId && (
              <AllergiesTableOne
                menuItems={menuItems}
                allAllergies={allAllergies}
                onEditMenuItem={handleEditMenuItem}
                onDeleteMenuItem={handleDeleteMenuItem}
              />
            )}
          </>
        ) : (
          <AllergiesEmptyState group={group} />
        )}
      </div>
    </div>
  );
}
