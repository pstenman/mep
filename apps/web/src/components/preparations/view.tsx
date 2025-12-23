"use client";

import type { PrepGroup } from "@/utils/nav-path/types";
import { trpc } from "@/lib/trpc/client";
import {
  mapGroupToType,
  filterGroupsByType,
} from "@/utils/preparations/group-to-type";
import { PreparationsList } from "./list";
import { EmptyState } from "./empty-state";
import { Loader2 } from "lucide-react";
import { PreparationsSheet } from "./sheet";

interface PreparationsViewProps {
  group: PrepGroup | "all";
}

export function PreparationsView({ group }: PreparationsViewProps) {
  const type = group === "all" ? "all" : group;
  const prepType = mapGroupToType("preparations", type);

  const { data, isLoading } = trpc.preparations.prepGroups.getAll.useQuery({
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
    "preparations",
    data?.data.items,
    prepType,
  );
  const hasGroups = filteredGroups.length > 0;

  return (
    <>
      <div className="flex w-full justify-center">
        <div className="w-full px-3 py-4 md:px-6 lg:px-8 max-w-full lg:max-w-[794px]">
          {hasGroups ? (
            <PreparationsList type={type} />
          ) : (
            type !== "all" && <EmptyState group={type} />
          )}
        </div>
      </div>
      <PreparationsSheet />
    </>
  );
}
