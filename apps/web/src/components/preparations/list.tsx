"use client";

import { trpc } from "@/lib/trpc/client";
import type { PrepGroup } from "@/lib/navigation/dashboard/types";
import {
  mapGroupToPrepType,
  filterGroupsByPrepType,
  parsePrepTypes,
} from "@/utils/filters/prep-type-helpers";
import { Text } from "@mep/ui";
import { Loader2 } from "lucide-react";

interface PreparationsListProps {
  type: PrepGroup | "all";
}

export function PreparationsList({ type }: PreparationsListProps) {
  const prepType = mapGroupToPrepType("preparations", type);

  const { data, isLoading } = trpc.preparations.prepGroups.getAll.useQuery({
    filter: {},
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  const filteredGroups = filterGroupsByPrepType(
    "preparations",
    data?.data.items,
    prepType ? String(prepType) : null,
  );

  const sortedGroups = [...filteredGroups].sort((a, b) => {
    const aTypes = parsePrepTypes(a.prepTypes).join(",");
    const bTypes = parsePrepTypes(b.prepTypes).join(",");
    if (aTypes !== bTypes) {
      return aTypes.localeCompare(bTypes);
    }
    return (a.name as string).localeCompare(b.name as string);
  });

  if (sortedGroups.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {sortedGroups.map((group) => (
        <div key={group.id as string} className="border rounded-lg p-4">
          <Text className="font-semibold text-lg">{group.name as string}</Text>
          {group.note && (
            <Text className="text-sm text-muted-foreground mt-1">
              {String(group.note)}
            </Text>
          )}
          {Array.isArray(group.prepItems) && group.prepItems.length > 0 ? (
            <div className="mt-3 space-y-1">
              {(
                group.prepItems as Array<{
                  id: string;
                  name: string;
                  status: string;
                }>
              ).map((item) => (
                <div
                  key={item.id}
                  className="text-sm flex items-center justify-between"
                >
                  <Text>{item.name}</Text>
                  <Text className="text-muted-foreground">{item.status}</Text>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
}
