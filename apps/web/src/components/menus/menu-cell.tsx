"use client";

import type { Row } from "@tanstack/react-table";
import { trpc } from "@/lib/trpc/client";
import { Checkbox } from "@mep/ui";
import type { MenuType } from "@mep/types";

interface MenuItem {
  id: string;
  name: string;
  menuType: MenuType;
  isActive: boolean;
}

interface MenuCellProps {
  row: Row<MenuItem>;
  menuType: MenuType | null;
}

export function MenuCell({ row, menuType }: MenuCellProps) {
  const utils = trpc.useUtils();

  const setActive = trpc.menus.setActive.useMutation({
    onSuccess: () => {
      utils.menus.getAll.invalidate();
      utils.menus.getActive.invalidate();
    },
    onError: (error: Error) => {
      console.error("Failed to set active menu:", error);
    },
  });

  const handleCheckedChange = (checked: boolean) => {
    if (!menuType || !checked) {
      return;
    }

    setActive.mutate({
      id: row.original.id,
      menuType,
    });
  };

  return (
    <div className="flex items-center justify-center w-full h-full">
      <Checkbox
        checked={row.original.isActive}
        disabled={setActive.isPending || !menuType}
        onCheckedChange={handleCheckedChange}
      />
    </div>
  );
}
