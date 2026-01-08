"use client";

import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc/client";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  Button,
  Text,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@mep/ui";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import type { UserOutput } from "@mep/api";
import type { TRPCError } from "@trpc/server";

interface TransferOwnershipDialogProps {
  open: boolean;
  onClose: () => void;
  companyId: string;
  onSuccess?: () => void;
}

export function TransferOwnershipDialog({
  open,
  onClose,
  companyId,
  onSuccess,
}: TransferOwnershipDialogProps) {
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const utils = trpc.useUtils();
  const t = useTranslations("users.transferOwnership");

  const { data: ownersData } = trpc.memberships.getOwners.useQuery(
    { companyId },
    { enabled: open },
  );

  const { data: userData } = trpc.users.getCurrentUser.useQuery();
  const currentUserCompanyId = userData?.data?.memberships?.[0]?.companyId;

  const { data: usersData } = trpc.users.getAll.useQuery(
    {
      filter: {},
    },
    { enabled: open && !!currentUserCompanyId },
  );

  const transferOwnership = trpc.memberships.transferOwnership.useMutation({
    onSuccess: () => {
      toast.success(t("toast.success"));
      utils.memberships.getOwners.invalidate();
      utils.users.getCurrentUser.invalidate();
      utils.users.checkDeletionEligibility.invalidate();
      onSuccess?.();
      onClose();
      setSelectedUserId("");
    },
    onError: (error: TRPCError) => {
      toast.error(error.message || t("toast.error"));
    },
  });

  useEffect(() => {
    if (!open) {
      setSelectedUserId("");
    }
  }, [open]);

  const handleTransfer = async () => {
    if (!selectedUserId) {
      toast.error(t("toast.selectUser"));
      return;
    }

    if (!confirm(t("confirmMessage"))) {
      return;
    }

    await transferOwnership.mutateAsync({
      companyId,
      toUserId: selectedUserId,
    });
  };

  const ownerIds =
    ownersData?.data?.map((o: { userId: string }) => o.userId) || [];
  const availableUsers =
    usersData?.data?.items?.filter(
      (user: UserOutput) =>
        !ownerIds.includes(user.id) && user.id !== userData?.data?.id,
    ) || [];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
          <DialogDescription>{t("description")}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            {availableUsers.length > 0 && (
              <>
                <Text className="text-sm font-medium mb-2">
                  {t("selectLabel")}
                </Text>
                <Select
                  value={selectedUserId}
                  onValueChange={setSelectedUserId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t("selectPlaceholder")} />
                  </SelectTrigger>
                  <SelectContent>
                    {availableUsers.map((user: UserOutput) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.firstName} {user.lastName} ({user.email})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </>
            )}
            {availableUsers.length === 0 && (
              <Text className="text-sm text-muted-foreground">
                {t("noUsersMessage")}
              </Text>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            {t("cancel")}
          </Button>
          <Button
            onClick={handleTransfer}
            disabled={!selectedUserId || transferOwnership.isPending}
          >
            {transferOwnership.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {t("transferring")}
              </>
            ) : (
              t("transferButton")
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
