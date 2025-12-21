import type { TRPCInputs, TRPCOutputs } from "@/trpc/router";

// ======================================================================================================
// STRIPE TYPES
// ======================================================================================================
export type CreateStripeSubscriptionInput =
  NonNullable<TRPCInputs>["stripe"]["createStripeSubscription"];
export type CreateStripeSubscriptionOutput =
  NonNullable<TRPCOutputs>["stripe"]["createStripeSubscription"];

// ======================================================================================================
// SUBSCRIPTIONS TYPES
// ======================================================================================================
export type CreateSubscriptionInput =
  NonNullable<TRPCInputs>["subscription"]["createSubscription"];
export type CreateSubscriptionOutput =
  NonNullable<TRPCOutputs>["subscription"]["createSubscription"];

// ======================================================================================================
// PLANS
// ======================================================================================================

// By Id
export type PlanById = NonNullable<TRPCOutputs>["plans"]["getById"];
