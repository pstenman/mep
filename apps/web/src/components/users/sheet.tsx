"use client";

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@mep/ui";
import { parseAsBoolean, parseAsString } from "nuqs";
import { useQueryState } from "nuqs";
import { trpc } from "@/lib/trpc/client";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { UserForm } from "./form";

export const useUserSheet = () => {
  const [isOpen, setIsOpen] = useQueryState(
    "userSheetOpen",
    parseAsBoolean.withDefault(false),
  );
  const [userId, setUserId] = useQueryState(
    "userId",
    parseAsString.withDefault(""),
  );

  console.log("useUserSheet -> isOpen,", isOpen, "userId", userId);

  const open = (id?: string) => {
    console.log("useUserSheet -> open,", id);
    setUserId(id || "");
    setIsOpen(true);
  };

  const close = () => {
    console.log("useUserSheet -> close");
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
  const { isOpen, userId, close } = useUserSheet();
  const utils = trpc.useUtils();

  const { data, isLoading } = trpc.users.getById.useQuery(
    { id: userId },
    { enabled: !!userId && isOpen },
  );

  const handleSuccess = () => {
    utils.users.getAll.invalidate();
    toast.success("User updated successfully");
    close();
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && close()}>
      <SheetContent className="overflow-y-auto">
        <SheetHeader className="mb-4 pb-4 border-b">
          <SheetTitle>{userId ? "Edit" : "Create"} User</SheetTitle>
        </SheetHeader>

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
      </SheetContent>
    </Sheet>
  );
}
