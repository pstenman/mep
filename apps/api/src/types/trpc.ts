import type { TRPCInputs, TRPCOutputs } from "@/trpc/router";

// ======================================================================================================
// STRIPE TYPES
// ======================================================================================================
export type CreateSubscriptionInput =
  NonNullable<TRPCInputs>["stripe"]["createCustomerAndSubscription"];
export type CreateSubscriptionOutput =
  NonNullable<TRPCOutputs>["stripe"]["createCustomerAndSubscription"];

// ======================================================================================================
// SUPABASE AUTH
// ======================================================================================================
export type CreateAuthInput = NonNullable<TRPCInputs>["auth"]["create"];
export type CreateAuthOutput = NonNullable<TRPCOutputs>["auth"]["create"];

// ======================================================================================================
// PLANS
// ======================================================================================================

// By Id
export type PlanById = NonNullable<TRPCOutputs>["plans"]["getById"];
