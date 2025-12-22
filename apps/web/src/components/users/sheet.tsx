"use client";

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@mep/ui";
import { parseAsBoolean, parseAsString } from "nuqs";
import { useQueryState } from "nuqs";
import { trpc } from "@/lib/trpc/client";
import { Loader2 } from "lucide-react";
import { UserForm } from "./form";
import { useTranslations } from "next-intl";

export const useUserSheet = () => {
  const [isOpen, setIsOpen] = useQueryState(
    "userSheetOpen",
    parseAsBoolean.withDefault(false),
  );
  const [userId, setUserId] = useQueryState(
    "userId",
    parseAsString.withDefault(""),
  );

  const open = (id?: string) => {
    setUserId(id || "");
    setIsOpen(true);
  };

  const close = () => {
    setUserId("");
    setIsOpen(false);
  };

  return {
    isOpen,
    open,
    close,
    userId: userId || null,
  };
};

export function UserSheet() {
  const t = useTranslations("users");
  const { isOpen, userId, close } = useUserSheet();
  const utils = trpc.useUtils();

  const { data, isLoading } = trpc.users.getById.useQuery(
    { id: userId },
    { enabled: !!userId && isOpen },
  );

  const handleSuccess = () => {
    utils.users.getAll.invalidate();
    close();
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && close()}>
      <SheetContent className="flex flex-col p-0">
        <SheetHeader className="px-6 pt-6 pb-4 border-b shrink-0">
          <SheetTitle>
            {userId ? t("form.title.edit") : t("form.title.create")}
          </SheetTitle>
        </SheetHeader>
        <div className="flex-1 min-h-0">
          {!isLoading ? (
            <UserForm
              user={data || undefined}
              onSuccess={handleSuccess}
              onCancel={close}
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
