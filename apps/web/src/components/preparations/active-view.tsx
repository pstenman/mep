"use client";

import { useMemo } from "react";
import { trpc } from "@/lib/trpc/client";
import { PrepListGrid } from "./list-grid";
import { Button } from "@mep/ui";
import type { PrepType, PrepStatus } from "@mep/types";
import { Loader2 } from "lucide-react";

interface PrepGroupWithItems {
  id: string;
  name: string;
  prepItems: {
    id: string;
    name: string;
    status: PrepStatus;
  }[];
}

interface ActivePrepViewProps {
  prepType: PrepType | null;
}

export function ActivePrepView({ prepType }: ActivePrepViewProps) {
  const utils = trpc.useUtils();

  const { data, isLoading } = trpc.preparations.prepLists.getActive.useQuery(
    prepType ? { prepType } : undefined,
  );

  const createFromTemplate =
    trpc.preparations.prepLists.createFromTemplate.useMutation({
      onSuccess: () => {
        utils.preparations.prepLists.getActive.invalidate();
      },
    });

  const toggleItem = (_itemId: string) => {
    // TODO: mutation → status klar
  };

  const tomorrow = useMemo(() => {
    const date = new Date();
    date.setDate(date.getDate() + 1);
    date.setHours(0, 0, 0, 0);
    return date;
  }, []);

  const handleCreateNextDay = async () => {
    if (!prepType) return;
    await createFromTemplate.mutateAsync({
      prepType,
      date: tomorrow,
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  if (!data?.data) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <p className="text-muted-foreground">No active list found</p>
        {prepType && (
          <Button
            onClick={handleCreateNextDay}
            disabled={createFromTemplate.isPending}
          >
            {createFromTemplate.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Next Day"
            )}
          </Button>
        )}
      </div>
    );
  }

  const groups = (data.data.prepGroups || []).map(
    (group: PrepGroupWithItems) => ({
      id: group.id,
      name: group.name,
      items: (group.prepItems || []).map((item) => ({
        id: item.id,
        name: item.name,
        status: item.status,
      })),
    }),
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold">Active List</h2>
          {data.data && (
            <p className="text-sm text-muted-foreground">
              {new Date(data.data.date).toLocaleDateString()} • {data.data.name}
            </p>
          )}
        </div>
        {prepType && (
          <Button
            variant="outline"
            onClick={handleCreateNextDay}
            disabled={createFromTemplate.isPending}
          >
            {createFromTemplate.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Next Day"
            )}
          </Button>
        )}
      </div>
      {groups.length > 0 ? (
        <PrepListGrid groups={groups} onToggleItem={toggleItem} />
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          <p>No groups found in this list</p>
        </div>
      )}
    </div>
  );
}
