"use client";

import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc/client";
import { toast } from "sonner";
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  Text,
} from "@mep/ui";
import { Loader2, AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/auth/useAuth";
import { useTranslations } from "next-intl";
import { TransferOwnershipDialog } from "./transfer-ownership-dialog";

interface DeleteAccountDialogProps {
  open: boolean;
  onClose: () => void;
}

export function DeleteAccountDialog({
  open,
  onClose,
}: DeleteAccountDialogProps) {
  const router = useRouter();
  const { supabase } = useAuth();
  const utils = trpc.useUtils();
  const t = useTranslations("users.deleteAccount");

  const [step, setStep] = useState<"check" | "confirm" | "deleting">("check");
  const [showTransferDialog, setShowTransferDialog] = useState(false);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(
    null,
  );
  const { data: userData } = trpc.users.getCurrentUser.useQuery();
  const companyId = userData?.data?.memberships?.[0]?.companyId;
  const { data: subscription } = trpc.subscription.getSubscription.useQuery(
    undefined,
    {
      enabled: !!companyId,
    },
  );

  const cancelSubscription = trpc.memberships.cancelSubscription.useMutation({
    onSuccess: () => {
      toast.success(t("toast.cancelSuccess"));
      utils.users.checkDeletionEligibility.invalidate();
      utils.subscription.getSubscription.invalidate();
      setTimeout(() => {
        utils.users.checkDeletionEligibility.refetch();
      }, 500);
    },
    onError: (error: { message?: string }) => {
      toast.error(error.message || t("toast.cancelError"));
    },
  });

  const { data: eligibility, isLoading: checkingEligibility } =
    trpc.users.checkDeletionEligibility.useQuery(undefined, {
      enabled: open && step === "check",
    });

  const deleteAccount = trpc.users.requestDeletion.useMutation({
    onSuccess: async () => {
      toast.success(t("toast.deleteSuccess"));
      await supabase.auth.signOut();
      router.push("/login");
    },
    onError: (error: {
      message?: string;
      data?: {
        cause?: {
          requiresTransfer?: boolean;
          requiresCancellation?: boolean;
          companies?: Array<{
            id: string;
            name: string;
            hasActiveSubscription: boolean;
          }>;
        };
      };
    }) => {
      const cause = error.data?.cause;
      if (cause?.requiresTransfer || cause?.requiresCancellation) {
        setStep("check");
      } else {
        toast.error(error.message || t("toast.deleteError"));
        onClose();
      }
    },
  });

  useEffect(() => {
    if (open) {
      setStep("check");
    }
  }, [open]);

  useEffect(() => {
    if (eligibility?.data?.eligible && step === "check") {
      setStep("confirm");
    }
  }, [eligibility, step]);

  const handleDelete = async () => {
    setStep("deleting");
    await deleteAccount.mutateAsync();
  };

  const isEligible = eligibility?.data?.eligible ?? false;
  const requiresTransfer = eligibility?.data?.requiresTransfer ?? false;
  const requiresCancellation = eligibility?.data?.requiresCancellation ?? false;
  const companies = eligibility?.data?.companies ?? [];
  const reason = eligibility?.data?.reason;

  const handleCancelSubscription = async (companyIdToCancel: string) => {
    if (!confirm(t("confirmCancelSubscription"))) {
      return;
    }

    await cancelSubscription.mutateAsync({
      companyId: companyIdToCancel,
    });
  };

  const handleTransferSuccess = () => {
    utils.users.checkDeletionEligibility.invalidate();
  };

  if (step === "check" && checkingEligibility) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("title")}</DialogTitle>
            <DialogDescription>{t("checking")}</DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (step === "check" && !isEligible) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("cannotDelete")}</DialogTitle>
            <DialogDescription>{reason}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {companies.length > 0 && (
              <div className="rounded-lg border border-destructive bg-destructive/10 p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-destructive" />
                  <Text className="font-medium text-destructive">
                    {t("onlyOwner")}
                  </Text>
                </div>
                <ul className="list-disc list-inside space-y-1 ml-6">
                  {companies.map(
                    (company: {
                      id: string;
                      name: string;
                      hasActiveSubscription: boolean;
                    }) => (
                      <li key={company.id}>
                        <Text className="font-medium">{company.name}</Text>
                        {company.hasActiveSubscription && (
                          <Text className="text-sm text-muted-foreground ml-2">
                            {t("activeSubscription")}
                          </Text>
                        )}
                      </li>
                    ),
                  )}
                </ul>
                <Text className="text-sm mt-2">
                  {requiresTransfer && t("transferRequired")}
                  {requiresCancellation && t("cancelRequired")}
                </Text>
              </div>
            )}

            {(requiresTransfer || requiresCancellation) && (
              <div className="flex flex-col gap-2">
                {requiresTransfer && companyId && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedCompanyId(companyId);
                      setShowTransferDialog(true);
                    }}
                  >
                    {t("transferButton")}
                  </Button>
                )}

                {requiresCancellation &&
                  companies
                    .filter(
                      (c: {
                        id: string;
                        name: string;
                        hasActiveSubscription: boolean;
                      }) => c.hasActiveSubscription,
                    )
                    .map(
                      (company: {
                        id: string;
                        name: string;
                        hasActiveSubscription: boolean;
                      }) => {
                        const isAlreadyCanceled =
                          subscription?.cancelAtPeriodEnd ?? false;

                        if (isAlreadyCanceled) {
                          return (
                            <div
                              key={company.id}
                              className="text-sm text-muted-foreground p-2 rounded border"
                            >
                              {t("alreadyCanceled", { company: company.name })}
                            </div>
                          );
                        }

                        return (
                          <Button
                            key={company.id}
                            variant="destructive"
                            onClick={() => handleCancelSubscription(company.id)}
                            disabled={cancelSubscription.isPending}
                          >
                            {cancelSubscription.isPending ? (
                              <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                {t("canceling")}
                              </>
                            ) : (
                              t("cancelSubscription", { company: company.name })
                            )}
                          </Button>
                        );
                      },
                    )}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={onClose}>
              {t("close")}
            </Button>
          </DialogFooter>
          {companyId && (
            <TransferOwnershipDialog
              open={showTransferDialog}
              onClose={() => {
                setShowTransferDialog(false);
                setSelectedCompanyId(null);
              }}
              companyId={selectedCompanyId || companyId}
              onSuccess={handleTransferSuccess}
            />
          )}
        </DialogContent>
      </Dialog>
    );
  }

  if (step === "confirm" || (step === "check" && isEligible)) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("confirmTitle")}</DialogTitle>
            <DialogDescription>{t("confirmDescription")}</DialogDescription>
          </DialogHeader>
          <div className="rounded-lg border border-destructive bg-destructive/10 p-4">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-destructive mt-0.5" />
              <Text className="text-sm text-destructive">
                {t("confirmWarning")}
              </Text>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={onClose}>
              {t("cancel")}
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteAccount.isPending}
            >
              {deleteAccount.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {t("deleting")}
                </>
              ) : (
                t("deleteButton")
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("deletingTitle")}</DialogTitle>
          <DialogDescription>{t("deletingDescription")}</DialogDescription>
        </DialogHeader>
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin" />
        </div>
      </DialogContent>
    </Dialog>
  );
}
