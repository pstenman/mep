import { useState } from "react";
import { trpc } from "@/lib/trpc/client";
import type {CreateSetupIntentInput, CreateSetupIntentOutput} from "@mep/api"

export const useSetupIntent = () => {
  const utils = trpc.useUtils();
  const mutation = trpc.stripe.createSetupIntent.useMutation({
    onSuccess: () => utils.invalidate(),
  });

  const [clientSecret, setClientSecret] = useState<string | null>(null);

const create = async (input: CreateSetupIntentInput) => {
  const data: CreateSetupIntentOutput = await mutation.mutateAsync(input);

  if (!data.clientSecret) {
    throw new Error("Missing client secret from Stripe");
  }

  setClientSecret(data.clientSecret);
};

  return {
    clientSecret,
    create,
    loading: mutation.isLoading,
    isError: mutation.isError,
    error: mutation.error?.message ?? null,
  }
}