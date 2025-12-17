import { useState } from "react";
import { trpc } from "@/lib/trpc/client";
import type {
  CreateSubscriptionInput,
  CreateSubscriptionOutput,
} from "@mep/api";

export const useStripeSubscription = () => {
  const utils = trpc.useUtils();

  const mutation = trpc.stripe.createCustomerAndSubscription.useMutation({
    onSuccess: () => utils.invalidate(),
  });

  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [subscriptionId, setSubscriptionId] = useState<string | null>(null);
  const [subscriptionStatus, setSubscriptionStatus] = useState<string | null>(
    null,
  );
  const [plan, setPlan] = useState<string | null>(null);
  const [amount, setAmount] = useState<string | null>(null);

  const create = async (input: CreateSubscriptionInput): Promise<string> => {
    const data: CreateSubscriptionOutput = await mutation.mutateAsync(input);

    if (!data.clientSecret) {
      throw new Error("Missing client secret from Stripe");
    }

    setClientSecret(data.clientSecret);
    setSubscriptionId(data.subscriptionId);
    setSubscriptionStatus(data.subscriptionStatus);
    setAmount(data.amount);
    setPlan(data.plan);

    return data.clientSecret;
  };

  return {
    clientSecret,
    subscriptionId,
    subscriptionStatus,
    amount,
    plan,
    create,
    loading: mutation.isLoading,
    isError: mutation.isError,
    error: mutation.error?.message ?? null,
  };
};
