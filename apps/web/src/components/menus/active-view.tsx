"use client";

import { useState } from "react";
import { trpc } from "@/lib/trpc/client";
import { Loader2, FileText, Pencil, Trash2 } from "lucide-react";
import type { MenuType } from "@mep/types";
import { Text, Badge, Button } from "@mep/ui";
import { useMenusSheet } from "./sheet";
import { DynamicButton } from "@/components/ui/dynamic-button";
import { useTranslations } from "next-intl";
import type { MenuItemOutput } from "@mep/api";
import { DeleteDialog } from "../ui/delete-dialog";
import { toast } from "sonner";

interface ActiveMenuViewProps {
  menuType: MenuType | null;
  onTableClick?: () => void;
}

export function ActiveMenuView({
  menuType,
  onTableClick,
}: ActiveMenuViewProps) {
  const { open: openMenuSheet } = useMenusSheet();
  const t = useTranslations("menus");
  const utils = trpc.useUtils();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const { data: activeData, isLoading: activeLoading } =
    trpc.menus.getActive.useQuery(menuType ? { menuType } : undefined, {
      enabled: !!menuType,
    });

  const activeMenu = activeData?.data;

  const deleteMenu = trpc.menus.delete.useMutation({
    onSuccess: () => {
      toast.success(t("active.deleteSuccess"));
      utils.menus.getAll.invalidate();
      utils.menus.getActive.invalidate();
      setDeleteDialogOpen(false);
    },
    onError: (error: { message?: string }) => {
      toast.error(error.message || t("active.deleteError"));
    },
  });

  const handleDeleteClick = () => {
    if (activeMenu) {
      setDeleteDialogOpen(true);
    }
  };

  const handleDeleteConfirm = () => {
    if (activeMenu) {
      deleteMenu.mutate({ id: activeMenu.id });
    }
  };

  if (activeLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!activeMenu) {
    return (
      <div className="flex flex-col items-center">
        <div className="w-full flex items-center justify-end gap-4 mb-4">
          {onTableClick && (
            <DynamicButton
              icon={FileText}
              tooltip={t("active.viewAll")}
              size="icon"
              variant="outline"
              onClick={onTableClick}
              buttonClassName="rounded-full w-[40px] h-[40px]"
            />
          )}
        </div>
        <div className="w-full h-screen border-0 md:border rounded-lg p-4 shadow-md bg-background flex flex-col">
          <div className="flex items-center justify-center h-full">
            <Text className="text-muted-foreground">{t("active.noMenu")}</Text>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <div className="w-full flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Text className="text-2xl font-bold">{activeMenu.name}</Text>
          <Badge variant="default">{t("active.badge")}</Badge>
        </div>
        <div className="flex gap-2">
          {onTableClick && (
            <DynamicButton
              icon={FileText}
              tooltip={t("active.viewAll")}
              size="icon"
              variant="outline"
              onClick={onTableClick}
              buttonClassName="rounded-full w-[40px] h-[40px]"
            />
          )}
          <Button
            variant="outline"
            className="rounded-full w-[40px] h-[40px]"
            size="sm"
            onClick={() => openMenuSheet(activeMenu.id)}
          >
            <Pencil size={16} className="text-primary" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="rounded-full w-[40px] h-[40px]"
            onClick={handleDeleteClick}
          >
            <Trash2 size={16} className="text-destructive" />
          </Button>
        </div>
      </div>

      <div className="w-full h-screen border-0 md:border rounded-lg p-4 shadow-md bg-background flex flex-col mt-4">
        <div className="flex-1 overflow-y-auto">
          {activeMenu.menuItems && activeMenu.menuItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 justify-items-center">
              {activeMenu.menuItems.map((item: MenuItemOutput) => (
                <div
                  key={item.id}
                  className="relative w-full max-w-[300px] rounded-lg p-2 text-center"
                >
                  <Text className="font-bold text-base">{item.name}</Text>
                  {item.description ? (
                    <Text className="text-sm text-foreground mt-1 block">
                      {item.description}
                    </Text>
                  ) : (
                    <Text className="text-sm text-muted-foreground mt-1 italic">
                      {t("list.noDescription")}
                    </Text>
                  )}
                  {item.category && (
                    <Text className="text-xs text-muted-foreground mt-1">
                      {item.category}
                    </Text>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <Text className="text-muted-foreground">{t("list.noItems")}</Text>
            </div>
          )}
        </div>
      </div>

      <DeleteDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        isLoading={deleteMenu.isPending}
      />
    </div>
  );
}
