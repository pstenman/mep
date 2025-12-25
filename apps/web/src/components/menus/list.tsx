"use client";

import { useState, useMemo, useEffect } from "react";
import { trpc } from "@/lib/trpc/client";
import type { GroupKey } from "@/utils/nav-path/types";
import {
  mapGroupToType,
  filterGroupsByType,
} from "@/utils/preparations/group-to-type";
import {
  Text,
  Combobox,
  type ComboboxOption,
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@mep/ui";
import { Loader2, Trash2, Pencil } from "lucide-react";
import { useMenusSheet } from "./sheet";
import { toast } from "sonner";

interface MenusListProps {
  type: GroupKey | "all";
  group: string;
}

export function MenusList({ type, group }: MenusListProps) {
  const prepType = mapGroupToType("menus", type);

  const { data, isLoading } = trpc.menus.getAll.useQuery({});

  const filteredMenus = useMemo(() => {
    if (!data?.data?.items) return [];
    const filtered = filterGroupsByType(
      "menus",
      data.data.items,
      prepType,
    ) as Array<{
      id: string;
      name: string;
      note?: string | null;
      isActive: boolean;
      updatedAt: Date | string | null;
      menuItems?: Array<{
        id: string;
        name: string;
        description?: string | null;
        category?: string | null;
        status?: string | null;
      }>;
    }>;

    return [...filtered].sort((a, b) => {
      if (a.isActive && !b.isActive) return -1;
      if (!a.isActive && b.isActive) return 1;

      const aDate = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
      const bDate = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
      return bDate - aDate;
    });
  }, [data?.data?.items, prepType]);

  const defaultMenu = useMemo(() => {
    return filteredMenus.length > 0 ? filteredMenus[0] : null;
  }, [filteredMenus]);

  const [selectedMenuId, setSelectedMenuId] = useState<string | null>(null);

  useEffect(() => {
    if (defaultMenu && !selectedMenuId) {
      setSelectedMenuId(defaultMenu.id);
    }
  }, [defaultMenu, selectedMenuId]);

  const selectedMenu = useMemo(() => {
    if (!selectedMenuId) return defaultMenu;
    return (
      filteredMenus.find((menu) => menu.id === selectedMenuId) || defaultMenu
    );
  }, [selectedMenuId, filteredMenus, defaultMenu]);

  const { open: openMenuSheet } = useMenusSheet();

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [menuToDelete, setMenuToDelete] = useState<string | null>(null);

  const utils = trpc.useUtils();

  const deleteMenu = trpc.menus.delete.useMutation({
    onSuccess: () => {
      toast.success("Menu deleted successfully");
      utils.menus.getAll.invalidate();
      setDeleteDialogOpen(false);
      setMenuToDelete(null);

      if (selectedMenuId === menuToDelete) {
        setSelectedMenuId(defaultMenu?.id || null);
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

  const comboboxOptions: ComboboxOption<(typeof filteredMenus)[0]>[] =
    useMemo(() => {
      return filteredMenus.map((menu) => ({
        value: menu.id,
        label: menu.name || "Unnamed Menu",
        meta: menu,
      }));
    }, [filteredMenus]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!data?.data?.items || data.data.items.length === 0) {
    return <Text>No menus found.</Text>;
  }

  if (filteredMenus.length === 0) {
    return <Text>No menus found for {group}.</Text>;
  }

  if (!selectedMenu) {
    return <Text>No menu selected.</Text>;
  }

  return (
    <div className="flex flex-col items-center">
      <div className="w-full flex items-center justify-between gap-4">
        {/* Vänster: Combobox */}
        <div>
          <Combobox
            value={selectedMenuId || undefined}
            options={comboboxOptions}
            placeholder="Search and select a menu..."
            onValueChange={(value) => setSelectedMenuId(value)}
            onSelect={(option) => setSelectedMenuId(option.value)}
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectedMenu.menuItems.map((item: any) => (
                <div key={item.id} className="rounded-lg p-2 text-center">
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
                </div>
              ))}
            </div>
          ) : (
            <Text>No items in this menu.</Text>
          )}
        </div>
      </div>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Menu</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this menu? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setDeleteDialogOpen(false);
                setMenuToDelete(null);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={deleteMenu.isPending}
            >
              {deleteMenu.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
