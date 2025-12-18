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
export type CreateAuthOwnerInput =
  NonNullable<TRPCInputs>["auth"]["createOwner"];
export type CreateAuthOwnerOutput =
  NonNullable<TRPCOutputs>["auth"]["createOwner"];

// ======================================================================================================
// PLANS
// ======================================================================================================

// By Id
export type PlanById = NonNullable<TRPCOutputs>["plans"]["getById"];
