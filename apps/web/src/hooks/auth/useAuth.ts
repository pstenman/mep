import { trpc } from "@/lib/trpc/client";
import type { CreateAuthOwnerInput, CreateAuthOwnerOutput } from "@mep/api"
import { toast } from "sonner"


export const useAuthUser = () => {
  const utils = trpc.useUtils();

  const mutation = trpc.auth.createOwner.useMutation({
    onSuccess: () => utils.invalidate(),
  });

  const createAuthUser = async (input: CreateAuthOwnerInput) => {
    try {
      const data: CreateAuthOwnerOutput = await mutation.mutateAsync(input);
      return data;
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  };

  return {
    createAuthUser,
    loading: mutation.isLoading,
    error: mutation.error,
  };
};