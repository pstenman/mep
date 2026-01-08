"use client";

import { useState, useMemo } from "react";
import { trpc } from "@/lib/trpc/client";
import { PrepListGrid } from "./list-grid";
import {
  type PrepType,
  PrepStatus,
  type PrepListItem,
  type PrepListGroup,
  type Recipe,
} from "@mep/types";
import { Loader2, Plus, FileText } from "lucide-react";
import { DynamicButton } from "@/components/ui/dynamic-button";
import { DatePicker } from "@mep/ui";
import { getNextPrepStatus } from "@/utils/filters/prep-status-helpers";
import { CreateListDialog } from "./create-list-dialog";
import { RecipeViewDialog } from "@/components/recipes/view-dialog";
import { useTranslations } from "next-intl";

interface PrepGroupWithItems {
  id: string;
  name: string;
  notes?: Array<{
    id: string;
    message: string;
    createdBy: string;
    createdAt: string;
  }>;
  prepItems: PrepListItem[];
}

interface PrepList {
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
  const t = useTranslations("preparations");
  const utils = trpc.useUtils();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [recipeDialogOpen, setRecipeDialogOpen] = useState(false);

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

    return listsData.data.items.find((list: PrepList) => {
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
    const item = allItems.find((item: PrepListItem) => item.id === itemId);
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
          <h2 className="text-lg font-semibold">
            {t("prepList.activeView.noListFound")}
          </h2>
          <p className="text-sm text-muted-foreground">
            {selectedDate
              ? t("prepList.activeView.noListForDate", {
                  date: selectedDate.toLocaleDateString(),
                })
              : t("prepList.activeView.selectDateToView")}
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
          tooltip={t("prepList.activeView.tooltip.viewTemplates")}
          size="icon"
          variant="outline"
          onClick={onTemplatesClick}
          buttonClassName="rounded-full w-[32px] h-[32px]"
        />
      )}
      {prepType && (
        <DynamicButton
          icon={Plus}
          tooltip={t("prepList.activeView.tooltip.createNewList")}
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
              placeholder={t("createList.selectDate")}
            />
            {renderActionButtons()}
          </div>
          {renderHeader()}
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground">
              {selectedDate
                ? t("prepList.activeView.noListForDate", {
                    date: selectedDate.toLocaleDateString(),
                  })
                : t("prepList.activeView.pleaseSelectDate")}
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

  const groups: PrepListGroup[] = (selectedList.prepGroups || []).map(
    (group: PrepGroupWithItems) => {
      return {
        id: group.id,
        name: group.name,
        notes: group.notes || [],
        items: (group.prepItems || []).map((item) => ({
          id: item.id,
          name: item.name,
          status: item.status,
          recipeId: item.recipeId,
          recipe: item.recipe,
        })),
      };
    },
  );

  const handleRecipeClick = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setRecipeDialogOpen(true);
  };

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
            placeholder={t("createList.selectDate")}
          />
          {renderActionButtons()}
        </div>
        {renderHeader()}
        {groups.length > 0 ? (
          <PrepListGrid
            groups={groups}
            onStatusToggle={handleStatusToggle}
            onRecipeClick={handleRecipeClick}
          />
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <p>{t("prepList.activeView.noGroupsFound")}</p>
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
      <RecipeViewDialog
        open={recipeDialogOpen}
        onOpenChange={setRecipeDialogOpen}
        recipe={selectedRecipe}
      />
    </>
  );
}
