"use client";

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@mep/ui";
import { parseAsBoolean, parseAsString } from "nuqs";
import { useQueryState } from "nuqs";
import { MenuForm } from "./form";
import { useTranslations } from "next-intl";

export const useMenusSheet = () => {
  const [isOpen, setIsOpen] = useQueryState(
    "menusSheetOpen",
    parseAsBoolean.withDefault(false),
  );
  const [menuId, setMenuId] = useQueryState(
    "menuId",
    parseAsString.withDefault(""),
  );

  const open = (id?: string) => {
    setMenuId(id || "");
    setIsOpen(true);
  };

  const close = () => {
    setMenuId("");
    setIsOpen(false);
  };

  return { isOpen, open, close, menuId: menuId || null };
};

export function MenusSheet() {
  const t = useTranslations("menus");
  const { isOpen, close, menuId } = useMenusSheet();

  const handleSuccess = () => {
    close();
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && close()}>
      <SheetContent className="flex flex-col p-0">
        <SheetHeader className="px-6 pt-6 pb-4 border-b shrink-0">
          <SheetTitle>
            {menuId ? t("form.title.edit") : t("form.title.create")}
          </SheetTitle>
        </SheetHeader>
        <div className="flex-1 min-h-0">
          <MenuForm onSuccess={handleSuccess} onCancel={close} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
