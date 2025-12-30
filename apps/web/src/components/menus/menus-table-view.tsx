"use client";

import { useState } from "react";
import { trpc } from "@/lib/trpc/client";
import type { GroupKey } from "@/lib/navigation/dashboard/types";
import { urlGroupToMenuTypeFilter } from "@/utils/filters/url-to-api-filters";
import { Loader2, ArrowLeft } from "lucide-react";
import { useMenusSheet } from "./sheet";
import { toast } from "sonner";
import { DeleteDialog } from "../ui/delete-dialog";
import { MenusTable } from "./menus-table";
import { DynamicButton } from "@/components/ui/dynamic-button";
import type { MenuType } from "@mep/types";
import { useTranslations } from "next-intl";

interface MenusTableViewProps {
  type: GroupKey | "all";
  onBackClick?: () => void;
}

export function MenusTableView({ type, onBackClick }: MenusTableViewProps) {
  const menuTypeFilter = urlGroupToMenuTypeFilter(type);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [menuToDelete, setMenuToDelete] = useState<string | null>(null);
  const { open: openMenuSheet } = useMenusSheet();
  const utils = trpc.useUtils();
  const t = useTranslations("menus");
  const { data, isLoading } = trpc.menus.getAll.useQuery({
    filter: menuTypeFilter ? { menuType: menuTypeFilter } : undefined,
  });
  const menus = data?.data?.items ?? data?.data ?? [];

  const deleteMenu = trpc.menus.delete.useMutation({
    onSuccess: () => {
      toast.success(t("active.deleteSuccess"));
      utils.menus.getAll.invalidate();
      utils.menus.getActive.invalidate();
      setDeleteDialogOpen(false);
      setMenuToDelete(null);
    },
    onError: (error: { message?: string }) => {
      toast.error(error.message || t("active.deleteError"));
    },
  });

  const handleEdit = (id: string) => {
    openMenuSheet(id);
  };

  const handleDelete = (id: string) => {
    setMenuToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (menuToDelete) {
      deleteMenu.mutate({ id: menuToDelete });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold">{t("table.title")}</h2>
          <p className="text-sm text-muted-foreground">
            {t("table.description")}
          </p>
        </div>
        {onBackClick && (
          <DynamicButton
            icon={ArrowLeft}
            tooltip={t("table.backToActive")}
            size="icon"
            variant="outline"
            onClick={onBackClick}
            buttonClassName="rounded-full w-[32px] h-[32px]"
          />
        )}
      </div>
      <MenusTable
        menus={menus}
        menuType={menuTypeFilter as MenuType | null}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      <DeleteDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        isLoading={deleteMenu.isPending}
      />
    </div>
  );
}
