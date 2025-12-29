"use client";

import { trpc } from "@/lib/trpc/client";
import { EmptyState } from "../empty-state";
import { Loader2, Check, ArrowLeft, Calendar } from "lucide-react";
import type { PrepType } from "@mep/types";
import type { PrepGroup } from "@/lib/navigation/dashboard/types";
import { Badge } from "@mep/ui";
import { DynamicButton } from "@/components/ui/dynamic-button";

interface ListsHistoryViewProps {
  prepType: PrepType | null;
  onBackClick?: () => void;
}

interface PrepListItem {
  id: string;
  name: string;
  prepTypes: PrepType;
  scheduleFor: Date | null;
  prepGroups?: {
    id: string;
    name: string;
    prepItems?: {
      id: string;
      name: string;
    }[];
  }[];
}

export function ListsHistoryView({
  prepType,
  onBackClick,
}: ListsHistoryViewProps) {
  const { data: listsData, isLoading: listsLoading } =
    trpc.preparations.prepLists.getAll.useQuery({
      filter: prepType
        ? {
            type: prepType,
          }
        : undefined,
    });

  const getListStatus = (
    list: PrepListItem,
    allLists: PrepListItem[],
  ): "active" | "upcoming" | "history" => {
    if (!list.scheduleFor) {
      return "history";
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const scheduleDate = new Date(list.scheduleFor);
    scheduleDate.setHours(0, 0, 0, 0);

    const isFuture = scheduleDate > today;

    if (isFuture) {
      return "upcoming";
    }

    const sameTypeLists = allLists.filter(
      (l) => l.prepTypes === list.prepTypes && l.scheduleFor,
    );
    const activeSameType = sameTypeLists
      .filter((l) => {
        if (!l.scheduleFor) return false;
        const lDate = new Date(l.scheduleFor);
        lDate.setHours(0, 0, 0, 0);
        return lDate <= today;
      })
      .sort((a, b) => {
        if (!a.scheduleFor || !b.scheduleFor) return 0;
        return (
          new Date(b.scheduleFor).getTime() - new Date(a.scheduleFor).getTime()
        );
      });

    if (activeSameType.length > 0 && activeSameType[0].id === list.id) {
      return "active";
    }

    return "history";
  };

  if (listsLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  const lists = listsData?.data.items ?? [];
  const hasLists = lists.length > 0;

  if (!hasLists) {
    return (
      <EmptyState
        group={(prepType?.toLowerCase() as PrepGroup) || "breakfast"}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold">All Lists</h2>
          <p className="text-sm text-muted-foreground">
            View history, current, and upcoming preparation lists
          </p>
        </div>
        {onBackClick && (
          <DynamicButton
            icon={ArrowLeft}
            tooltip="Back to Active List"
            size="icon"
            variant="outline"
            onClick={onBackClick}
            buttonClassName="rounded-full w-[32px] h-[32px]"
          />
        )}
      </div>
      <div className="space-y-3">
        {lists.map((list: PrepListItem) => {
          const status = getListStatus(list, lists);
          const isActive = status === "active";
          const isUpcoming = status === "upcoming";
          const isHistory = status === "history";

          return (
            <div
              key={list.id}
              className={`
              border rounded-lg p-4 transition-colors
              ${
                isActive
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50"
              }
            `}
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-3">
                  <h3 className="font-semibold">{list.name}</h3>
                  {isActive && (
                    <Badge variant="default" className="gap-1">
                      <Check className="w-3 h-3" />
                      Active
                    </Badge>
                  )}
                  {isUpcoming && (
                    <Badge variant="secondary" className="gap-1">
                      <Calendar className="w-3 h-3" />
                      Upcoming
                    </Badge>
                  )}
                  {isHistory && (
                    <Badge variant="outline" className="gap-1">
                      History
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  {list.scheduleFor && (
                    <span className="text-sm text-muted-foreground">
                      {new Date(list.scheduleFor).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                {list.prepTypes}
              </p>
              {list.prepGroups && list.prepGroups.length > 0 && (
                <div className="mt-3 space-y-2">
                  {list.prepGroups.map((group) => (
                    <div key={group.id} className="text-sm">
                      <span className="font-medium">{group.name}</span>
                      {group.prepItems && group.prepItems.length > 0 && (
                        <ul className="ml-4 mt-1 space-y-1">
                          {group.prepItems.map((item) => (
                            <li key={item.id} className="text-muted-foreground">
                              • {item.name}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

