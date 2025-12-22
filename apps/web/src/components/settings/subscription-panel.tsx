"use client";

import { trpc } from "@/lib/trpc/client";
import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Badge, Button, Text } from "@mep/ui";
import type { PlanTranslation } from "@mep/types";

export function SubscriptionPanel() {
  const t = useTranslations("settings");
  const locale = useLocale();
  const { data: subscription, isLoading } =
    trpc.subscription.getSubscription.useQuery();
  const [billingUrl, setBillingUrl] = useState<string | null>(null);

  const createPortal = trpc.stripe.createBillingPortalSession.useMutation();

  const handleBillingPortal = async () => {
    if (!subscription) return;
    const { url } = await createPortal.mutateAsync({
      customerId: subscription.stripeCustomerId,
      returnUrl: window.location.href,
    });
    setBillingUrl(url);
    window.open(url, "_blank");
  };

  if (isLoading) return <Text>{t("subscription.loading")}</Text>;
  if (!subscription || !subscription.hasSubscription)
    return <Text>{t("subscription.noSubscription")}</Text>;

  const planTranslation =
    subscription.plan?.translations.find(
      (t: PlanTranslation) => t.locale === locale,
    ) ??
    subscription.plan?.translations.find(
      (t: PlanTranslation) => t.locale === "en",
    ) ??
    subscription.plan?.translations[0];
  const planName =
    planTranslation?.name ?? subscription.plan?.id ?? "Unknown Plan";

  const getStatusBadgeProps = (status: string) => {
    switch (status) {
      case "active":
        return {
          variant: "default" as const,
          className: "bg-brand-base text-white border-transparent",
        };
      case "past_due":
        return {
          variant: "outline" as const,
          className: "bg-warning-pale text-warning border-warning",
        };
      case "canceled":
        return {
          variant: "destructive" as const,
        };
      default:
        return {
          variant: "secondary" as const,
        };
    }
  };

  const statusBadgeProps = getStatusBadgeProps(subscription.status);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-between items-center">
        <Text className="font-medium">{t("subscription.plan")}</Text>
        <Text>{planName}</Text>
      </div>

      <div className="flex justify-between items-center">
        <Text className="font-medium">{t("subscription.status")}</Text>
        <Badge {...statusBadgeProps}>{subscription.status}</Badge>
      </div>

      <div className="flex justify-between items-center">
        <Text className="font-medium">{t("subscription.currentPeriod")}</Text>
        <Text>
          {new Date(subscription.currentPeriodStart).toLocaleDateString()} -{" "}
          {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
        </Text>
      </div>

      {subscription.cancelAtPeriodEnd && (
        <Text className="text-sm text-error">
          {t("subscription.cancelAtPeriodEnd")}
        </Text>
      )}

      <Button onClick={handleBillingPortal} className="mt-2">
        <Text>{t("subscription.manageButtonLabel")}</Text>
      </Button>
    </div>
  );
}
