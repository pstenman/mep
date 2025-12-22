"use client";

import { trpc } from "@/lib/trpc/client";
import { useState } from "react";
import { useLocale } from "next-intl";
import { Badge, Button } from "@mep/ui";
import type { PlanTranslation } from "@mep/types";

export function SubscriptionPanel() {
  const locale = useLocale();
  const { data: subscription, isLoading } = trpc.subscription.getSubscription.useQuery();
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

  if (isLoading) return <p>Loading subscription...</p>;
  if (!subscription || !subscription.hasSubscription) return <p>No subscription found.</p>;

  const planTranslation =
    subscription.plan?.translations.find((t: PlanTranslation) => t.locale === locale) ??
    subscription.plan?.translations.find((t: PlanTranslation) => t.locale === "en") ??
    subscription.plan?.translations[0];
  const planName = planTranslation?.name ?? subscription.plan?.id ?? "Unknown Plan";

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
        <span className="font-medium">Plan:</span>
        <span>{planName}</span>
      </div>

      <div className="flex justify-between items-center">
        <span className="font-medium">Status:</span>
        <Badge {...statusBadgeProps}>{subscription.status}</Badge>
      </div>

      <div className="flex justify-between items-center">
        <span className="font-medium">Current Period:</span>
        <span>
          {new Date(subscription.currentPeriodStart).toLocaleDateString()} -{" "}
          {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
        </span>
      </div>

      {subscription.cancelAtPeriodEnd && (
        <p className="text-sm text-error">
          Subscription will cancel at the end of the period.
        </p>
      )}

      <Button onClick={handleBillingPortal} className="mt-2">
        Manage Subscription
      </Button>
    </div>
  );
};
    
