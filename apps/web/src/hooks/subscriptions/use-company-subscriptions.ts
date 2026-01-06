import { trpc } from "@/lib/trpc/client";
import type { CreateStripeSubscriptionInput } from "@mep/api";
import { useState, useCallback } from "react";

type CreateStripeSubscriptionInputForm = Omit<
  CreateStripeSubscriptionInput,
  "userId" | "companyId" | "membershipId"
>;

export const useCompanySubscription = () => {
  const utils = trpc.useUtils();

  const authMutation = trpc.subscription.createSubscription.useMutation({
    onSuccess: () => utils.invalidate(),
  });

  const stripeMutation = trpc.stripe.createStripeSubscription.useMutation({
    onSuccess: () => utils.invalidate(),
  });

  const cleanupMutation =
    trpc.subscription.cleanupFailedSubscription.useMutation();

  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [subscriptionId, setSubscriptionId] = useState<string | null>(null);
  const [subscriptionStatus, setSubscriptionStatus] = useState<string | null>(
    null,
  );
  const [plan, setPlan] = useState<string | null>(null);
  const [amount, setAmount] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [authData, setAuthData] = useState<{
    userId: string;
    companyId: string;
    membershipId: string;
  } | null>(null);

  const createSubscription = async (
    input: CreateStripeSubscriptionInputForm,
  ) => {
    try {
      const authDataResult = await authMutation.mutateAsync({
        email: input.email,
        firstName: input.firstName,
        lastName: input.lastName,
        companyName: input.companyName,
        companyRegistrationNumber: input.companyRegistrationNumber ?? "",
      });

      setAuthData(authDataResult);

      const stripeData = await stripeMutation.mutateAsync({
        email: input.email,
        companyName: input.companyName,
        companyRegistrationNumber: input.companyRegistrationNumber ?? "",
        userId: authDataResult.userId,
        companyId: authDataResult.companyId,
        membershipId: authDataResult.membershipId,
      });

      setClientSecret(stripeData.clientSecret);
      setSubscriptionId(stripeData.subscriptionId);
      setSubscriptionStatus(stripeData.subscriptionStatus);
      setPlan(stripeData.plan);
      setAmount(stripeData.amount);

      return stripeData.clientSecret;
    } catch (err) {
      console.error("Subscription creation failed", err);

      if (authData) {
        try {
          await cleanupMutation.mutateAsync({
            userId: authData.userId,
            companyId: authData.companyId,
            membershipId: authData.membershipId,
          });
        } catch (cleanupError) {
          console.error("Cleanup failed", cleanupError);
        }
        setAuthData(null);
      }

      throw err;
    } finally {
      setLoading(false);
    }
  };

  const cleanup = useCallback(async () => {
    if (authData) {
      try {
        await cleanupMutation.mutateAsync({
          userId: authData.userId,
          companyId: authData.companyId,
          membershipId: authData.membershipId,
        });
        setAuthData(null);
      } catch (error) {
        console.error("Cleanup failed", error);
      }
    }
  }, [authData, cleanupMutation]);

  return {
    clientSecret,
    subscriptionId,
    subscriptionStatus,
    plan,
    amount,
    loading,
    createSubscription,
    cleanup,
    authError: authMutation.error,
    stripeError: stripeMutation.error,
  };
};
