"use client";

import type { GroupKey } from "@/utils/nav-path/types";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@mep/ui";
import { useParams } from "next/navigation";
import { parseAsBoolean } from "nuqs";
import { useQueryState } from "nuqs";

export const useMenusSheet = () => {
  const [isOpen, setIsOpen] = useQueryState(
    "menusSheetOpen",
    parseAsBoolean.withDefault(false),
  );

  const open = () => {
    setIsOpen(true);
  };

  const close = () => {
    setIsOpen(false);
  };

  return { isOpen, open, close };
};

export function MenusSheet() {
  const { isOpen, close } = useMenusSheet();
  const params = useParams();
  const group = (params?.group as GroupKey) || "all";

  const handleSuccess = () => {
    close();
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && close()}>
      <SheetContent className="flex flex-col p-0">
        <SheetHeader className="px-6 pt-6 pb-4 border-b shrink-0">
          <SheetTitle>Create Menu</SheetTitle>
        </SheetHeader>
        <div className="flex-1 min-h-0">
          {/* <MenusForm type={group} onSuccess={handleSuccess} onCancel={close} /> */}
        </div>
      </SheetContent>
    </Sheet>
  );
}
