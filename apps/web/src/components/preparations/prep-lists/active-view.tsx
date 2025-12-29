"use client";

import { useState, useMemo } from "react";
import { trpc } from "@/lib/trpc/client";
import { PrepListGrid } from "./list-grid";
import { type PrepType, PrepStatus } from "@mep/types";
import { Loader2, Plus, FileText } from "lucide-react";
import { DynamicButton } from "@/components/ui/dynamic-button";
import { DatePicker } from "@mep/ui";
import { getNextPrepStatus } from "@/utils/filters/prep-status-helpers";
import { CreateListDialog } from "./create-list-dialog";

interface PrepGroupWithItems {
  id: string;
  name: string;
  prepItems: {
    id: string;
    name: string;
    status: PrepStatus;
  }[];
}

interface PrepItem {
  id: string;
  name: string;
  status: PrepStatus;
}

interface PrepListItem {
  id: string;
  name: string;
  prepTypes: PrepType;
  scheduleFor: Date | null;
  prepGroups?: PrepGroupWithItems[];
}

interface ActivePrepViewProps {
  prepType: PrepType | null;
  onTemplatesClick?: () => void;
}

export function ActivePrepView({
  prepType,
  onTemplatesClick,
}: ActivePrepViewProps) {
  const utils = trpc.useUtils();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  const today = useMemo(() => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    return date;
  }, []);

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(today);
  const isToday = useMemo(() => {
    if (!selectedDate) return false;
    return selectedDate.getTime() === today.getTime();
  }, [selectedDate, today]);

  const { data: activeData, isLoading: activeLoading } =
    trpc.preparations.prepLists.getActive.useQuery(
      prepType ? { prepType } : undefined,
      { enabled: isToday && !!prepType },
    );

  const { data: listsData, isLoading: listsLoading } =
    trpc.preparations.prepLists.getAll.useQuery(
      {
        filter: prepType ? { type: prepType } : undefined,
      },
      { enabled: !isToday && !!prepType },
    );

  const selectedList = useMemo(() => {
    if (isToday) {
      return activeData?.data || null;
    }

    if (!selectedDate || !listsData?.data.items) return null;

    const normalizedSelectedDate = new Date(selectedDate);
    normalizedSelectedDate.setHours(0, 0, 0, 0);

    return listsData.data.items.find((list: PrepListItem) => {
      if (!list.scheduleFor) return false;
      const listDate = new Date(list.scheduleFor);
      listDate.setHours(0, 0, 0, 0);
      return listDate.getTime() === normalizedSelectedDate.getTime();
    });
  }, [isToday, activeData, selectedDate, listsData]);

  const isLoading = isToday ? activeLoading : listsLoading;

  const updatePrepItem = trpc.preparations.prepItems.update.useMutation({
    onSuccess: () => {
      utils.preparations.prepLists.getActive.invalidate();
      utils.preparations.prepLists.getAll.invalidate();
    },
  });

  const handleStatusToggle = (itemId: string) => {
    if (!selectedList) return;

    const allItems = (selectedList.prepGroups || []).flatMap(
      (group: PrepGroupWithItems) => group.prepItems || [],
    );
    const item = allItems.find((item: PrepItem) => item.id === itemId);
    if (!item) return;

    const nextStatus = getNextPrepStatus(item?.status || PrepStatus.NONE);

    updatePrepItem.mutate({
      id: itemId,
      status: nextStatus,
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
    <div className="mb-6">
      {selectedList ? (
        <>
          <h2 className="text-lg font-semibold">{selectedList.name}</h2>
          {selectedList.scheduleFor && (
            <p className="text-sm text-muted-foreground">
              {new Date(selectedList.scheduleFor).toLocaleDateString()}
            </p>
          )}
        </>
      ) : (
        <>
          <h2 className="text-lg font-semibold">No list found</h2>
          <p className="text-sm text-muted-foreground">
            {selectedDate
              ? `No list found for ${selectedDate.toLocaleDateString()}`
              : "Select a date to view a list"}
          </p>
        </>
      )}
    </div>
  );

  const renderActionButtons = () => (
    <div className="flex items-center gap-2">
      {onTemplatesClick && (
        <DynamicButton
          icon={FileText}
          tooltip="View Templates"
          size="icon"
          variant="outline"
          onClick={onTemplatesClick}
          buttonClassName="rounded-full w-[32px] h-[32px]"
        />
      )}
      {prepType && (
        <DynamicButton
          icon={Plus}
          tooltip="Create New List"
          size="icon"
          variant="outline"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setCreateDialogOpen(true);
          }}
          buttonClassName="rounded-full w-[32px] h-[32px]"
          type="button"
        />
      )}
    </div>
  );

  if (!selectedList) {
    return (
      <>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <DatePicker
              value={selectedDate}
              onChange={(date) => {
                if (date) {
                  const normalizedDate = new Date(date);
                  normalizedDate.setHours(0, 0, 0, 0);
                  setSelectedDate(normalizedDate);
                } else {
                  setSelectedDate(today);
                }
              }}
              placeholder="Select date"
            />
            {renderActionButtons()}
          </div>
          {renderHeader()}
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground">
              {selectedDate
                ? `No list found for ${selectedDate.toLocaleDateString()}`
                : "Please select a date"}
            </p>
          </div>
        </div>
        {prepType && (
          <CreateListDialog
            open={createDialogOpen}
            onOpenChange={setCreateDialogOpen}
            prepType={prepType}
          />
        )}
      </>
    );
  }

  const groups = (selectedList.prepGroups || []).map(
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
    <>
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <DatePicker
            value={selectedDate}
            onChange={(date) => {
              if (date) {
                const normalizedDate = new Date(date);
                normalizedDate.setHours(0, 0, 0, 0);
                setSelectedDate(normalizedDate);
              } else {
                setSelectedDate(today);
              }
            }}
            placeholder="Select date"
          />
          {renderActionButtons()}
        </div>
        {renderHeader()}
        {groups.length > 0 ? (
          <PrepListGrid groups={groups} onStatusToggle={handleStatusToggle} />
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <p>No groups found in this list</p>
          </div>
        )}
      </div>
      {prepType && (
        <CreateListDialog
          open={createDialogOpen}
          onOpenChange={setCreateDialogOpen}
          prepType={prepType}
        />
      )}
    </>
  );
}
