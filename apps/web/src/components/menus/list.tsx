"use client";

import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc/client";
import type { GroupKey } from "@/utils/nav-path/types";
import { mapGroupToType } from "@/utils/preparations/group-to-type";
import { Text, Button } from "@mep/ui";
import { Loader2, Trash2, Pencil } from "lucide-react";
import { useMenusSheet } from "./sheet";
import { toast } from "sonner";
import type { MenuOutput } from "@mep/api";
import { MenuCombobox } from "./autocomplete";
import { MenuItemActions } from "../ui/action-menu";
import { DeleteDialog } from "../ui/delete-dialog";

interface MenusListProps {
  type: GroupKey | "all";
  group: string;
}

export function MenusList({ type, group }: MenusListProps) {
  const menuType = mapGroupToType("menus", type);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [menuToDelete, setMenuToDelete] = useState<string | null>(null);
  const [selectedMenuId, setSelectedMenuId] = useState<string | null>(null);
  const { open: openMenuSheet } = useMenusSheet();
  const utils = trpc.useUtils();

  const { data, isLoading } = trpc.menus.getAll.useQuery({
    menuType: menuType ?? undefined,
  });
  const menus = data?.data?.items ?? [];

  useEffect(() => {
    if (!selectedMenuId && menus.length > 0) {
      setSelectedMenuId(menus[0].id);
    }
  }, [menus, selectedMenuId]);

  const selectedMenu =
    menus.find((menu: MenuOutput) => menu.id === selectedMenuId) ?? menus[0];

  const deleteMenu = trpc.menus.delete.useMutation({
    onSuccess: () => {
      toast.success("Menu deleted successfully");
      utils.menus.getAll.invalidate();
      setDeleteDialogOpen(false);
      setMenuToDelete(null);

      if (selectedMenuId === menuToDelete) {
        setSelectedMenuId(menus[0]?.id ?? null);
      }
    },
    onError: (error: { message?: string }) => {
      toast.error(error.message || "Failed to delete menu");
    },
  });

  const handleDeleteClick = (menuId: string) => {
    setMenuToDelete(menuId);
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
    <div className="flex flex-col items-center">
      <div className="w-full flex items-center justify-between gap-4">
        <div>
          <MenuCombobox
            menus={menus}
            value={selectedMenuId || undefined}
            onChange={(value) => setSelectedMenuId(value)}
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="rounded-full w-[40px] h-[40px]"
            size="sm"
            onClick={() => openMenuSheet(selectedMenu.id)}
          >
            <Pencil size={16} className="text-primary" />
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="rounded-full w-[40px] h-[40px]"
            onClick={() => handleDeleteClick(selectedMenu.id)}
          >
            <Trash2 size={16} className="text-destructive" />
          </Button>
        </div>
      </div>

      <div className=" w-full h-screen border rounded-lg p-4 shadow-md bg-background flex flex-col mt-4">
        <div className="flex-1 overflow-y-auto">
          {selectedMenu.menuItems && selectedMenu.menuItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 justify-center items-center">
              {selectedMenu.menuItems.map((item: any) => (
                <div
                  key={item.id}
                  className="relative max-w-[300px] rounded-lg p-2 text-center"
                >
                  <Text className="font-bold text-base">{item.name}</Text>
                  {item.description && (
                    <Text className="text-sm text-foreground mt-1">
                      {item.description}
                    </Text>
                  )}
                  {item.category && (
                    <Text className="text-xs text-muted-foreground mt-1">
                      {item.category}
                    </Text>
                  )}

                  <div className="absolute top-2 right-2 opacity-100 group-hover:opacity-100 transition">
                    <MenuItemActions
                      onEdit={() => openMenuSheet(selectedMenu.id)}
                      onDelete={() => handleDeleteClick(item.menuId)}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <Text>No items in this menu.</Text>
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
