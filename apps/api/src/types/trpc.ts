import type { TRPCInputs, TRPCOutputs } from "@/trpc/router";

// ======================================================================================================
// STRIPE TYPES
// ======================================================================================================
export type CreateCompanySubscriptionInput =
  NonNullable<TRPCInputs>["stripe"]["createCompanySubscription"];
export type CreateCompanySubscriptionOutput =
  NonNullable<TRPCOutputs>["stripe"]["createCompanySubscription"];

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
