import { trpc } from "@/lib/trpc/client";
import type { CreateCompanySubscriptionInput } from "@mep/api";
import { useState } from "react";

export const useCompanySubscription = () => {
  const utils = trpc.useUtils();

  const authMutation = trpc.auth.createOwner.useMutation({
    onSuccess: () => utils.invalidate(),
  });

  const stripeMutation = trpc.stripe.createCompanySubscription.useMutation({
    onSuccess: () => utils.invalidate(),
  });

  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [subscriptionId, setSubscriptionId] = useState<string | null>(null);
  const [subscriptionStatus, setSubscriptionStatus] = useState<string | null>(
    null,
  );
  const [plan, setPlan] = useState<string | null>(null);
  const [amount, setAmount] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const createSubscription = async (input: CreateCompanySubscriptionInput) => {
    try {
      await authMutation.mutateAsync({
        email: input.email,
        firstName: input.firstName,
        lastName: input.lastName,
        companyName: input.companyName,
        companyRegistrationNumber: input.companyRegistrationNumber ?? "",
      });

      const stripeData = await stripeMutation.mutateAsync({
        email: input.email,
        companyName: input.companyName,
        companyRegistrationNumber: input.companyRegistrationNumber ?? "",
      });

      setClientSecret(stripeData.clientSecret);
      setSubscriptionId(stripeData.subscriptionId);
      setSubscriptionStatus(stripeData.subscriptionStatus);
      setPlan(stripeData.plan);
      setAmount(stripeData.amount);

      return stripeData.clientSecret;
    } catch (err) {
      console.error("Subscription creation failed", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    clientSecret,
    subscriptionId,
    subscriptionStatus,
    plan,
    amount,
    loading,
    createSubscription,
    authError: authMutation.error,
    stripeError: stripeMutation.error,
  };
};
