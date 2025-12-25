"use client";

import type { GroupKey } from "@/utils/nav-path/types";
import { trpc } from "@/lib/trpc/client";
import {
  mapGroupToType,
  filterGroupsByType,
} from "@/utils/preparations/group-to-type";
import { MenusList } from "./list";
import { Loader2 } from "lucide-react";
import { EmptyState } from "./empty-state";
import { MenusSheet } from "./sheet";

interface MenusViewProps {
  group: GroupKey | "all";
}

export function MenusView({ group }: MenusViewProps) {
  const type = group === "all" ? "all" : group;
  const prepType = mapGroupToType("menus", type);

  const { data, isLoading } = trpc.menus.getAll.useQuery({
    filter: {},
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

  const filteredGroups = filterGroupsByType(
    "menus",
    data?.data.items,
    prepType,
  );

  const hasGroups = filteredGroups.length > 0;

  return (
    <>
      <div className="flex w-full justify-center">
        <div className="w-full px-3 py-4 md:px-6 lg:px-8 max-w-full lg:max-w-[794px]">
          {hasGroups ? (
            <MenusList type={type} group={group} />
          ) : (
            <EmptyState group={type} />
          )}
        </div>
      </div>
      <MenusSheet />
    </>
  );
}
