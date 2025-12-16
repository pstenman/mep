import type { TRPCInputs, TRPCOutputs } from "@/trpc/router";

// ======================================================================================================
// STRIPE TYPES
// ======================================================================================================
export type CreateSetupIntentInput = NonNullable<TRPCInputs>["stripe"]["createSetupIntent"];
export type CreateSetupIntentOutput = NonNullable<TRPCOutputs>["stripe"]["createSetupIntent"];

// ======================================================================================================
// SUPABASE AUTH
// ======================================================================================================
export type CreateAuthInput = NonNullable<TRPCInputs>["auth"]["create"];
export type CreateAuthOutput= NonNullable<TRPCOutputs>["auth"]["create"];