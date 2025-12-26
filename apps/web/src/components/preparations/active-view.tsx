"use client";

import { useMemo } from "react";
import { trpc } from "@/lib/trpc/client";
import { PrepListGrid } from "./list-grid";
import type { PrepType, PrepStatus } from "@mep/types";
import { Loader2, History, Plus } from "lucide-react";
import { DynamicButton } from "@/components/ui/dynamic-button";

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
  onHistoryClick?: () => void;
}

export function ActivePrepView({
  prepType,
  onHistoryClick,
}: ActivePrepViewProps) {
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

  const renderHeader = () => (
    <div className="flex justify-between items-center mb-6">
      <div>
        {data?.data ? (
          <>
            <h2 className="text-lg font-semibold">{data.data.name}</h2>
            <p className="text-sm text-muted-foreground">
              {new Date(data.data.date).toLocaleDateString()}
            </p>
          </>
        ) : (
          <>
            <h2 className="text-lg font-semibold">No active list</h2>
            <p className="text-sm text-muted-foreground">
              Create a new list to get started
            </p>
          </>
        )}
      </div>
      <div className="flex items-center gap-2">
        {onHistoryClick && (
          <DynamicButton
            icon={History}
            tooltip="View History"
            size="icon"
            variant="outline"
            onClick={onHistoryClick}
            buttonClassName="rounded-full w-[32px] h-[32px]"
          />
        )}
        {prepType && (
          <DynamicButton
            icon={Plus}
            tooltip="Create Next Day"
            size="icon"
            variant="outline"
            onClick={handleCreateNextDay}
            loading={createFromTemplate.isPending}
            disabled={createFromTemplate.isPending}
            buttonClassName="rounded-full w-[32px] h-[32px]"
          />
        )}
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  if (!data?.data) {
    return (
      <div className="space-y-4">
        {renderHeader()}
        <div className="flex flex-col items-center justify-center py-12">
          <p className="text-muted-foreground">No active list found</p>
        </div>
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
      {renderHeader()}
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
