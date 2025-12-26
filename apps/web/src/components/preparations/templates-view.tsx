"use client";

import { trpc } from "@/lib/trpc/client";
import { EmptyState } from "./empty-state";
import { Loader2, Check } from "lucide-react";
import type { PrepType } from "@mep/types";
import type { PrepGroup } from "@/lib/navigation/dashboard/types";
import { Button, Badge } from "@mep/ui";

interface TemplatesPrepViewProps {
  prepType: PrepType | null;
}

interface PrepListItem {
  id: string;
  name: string;
  prepTypes: PrepType;
  date: Date;
  isActive: boolean;
  prepGroups?: {
    id: string;
    name: string;
    prepItems?: {
      id: string;
      name: string;
    }[];
  }[];
}

export function TemplatesPrepView({ prepType }: TemplatesPrepViewProps) {
  const utils = trpc.useUtils();

  const { data: listsData, isLoading: listsLoading } =
    trpc.preparations.prepLists.getAll.useQuery({
      filter: prepType
        ? {
            type: prepType,
          }
        : undefined,
    });

  const setActive = trpc.preparations.prepLists.setActive.useMutation({
    onSuccess: () => {
      utils.preparations.prepLists.getAll.invalidate();
      utils.preparations.prepLists.getActive.invalidate();
    },
  });

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
      <h2 className="text-lg font-semibold">All Lists</h2>
      <div className="space-y-3">
        {lists.map((list: PrepListItem) => (
          <div
            key={list.id}
            className={`
              border rounded-lg p-4 transition-colors
              ${
                list.isActive
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50"
              }
            `}
          >
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-3">
                <h3 className="font-semibold">{list.name}</h3>
                {list.isActive && (
                  <Badge variant="default" className="gap-1">
                    <Check className="w-3 h-3" />
                    Active
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground">
                  {new Date(list.date).toLocaleDateString()}
                </span>
                {!list.isActive && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setActive.mutate({ id: list.id })}
                    disabled={setActive.isPending}
                  >
                    {setActive.isPending ? (
                      <>
                        <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                        Activating...
                      </>
                    ) : (
                      "Set Active"
                    )}
                  </Button>
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
        ))}
      </div>
    </div>
  );
}
