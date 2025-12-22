import type { TRPCInputs, TRPCOutputs } from "@/trpc/router";

// ======================================================================================================
// STRIPE TYPES
// ======================================================================================================
export type CreateStripeSubscriptionInput =
  NonNullable<TRPCInputs>["stripe"]["createStripeSubscription"];
export type CreateStripeSubscriptionOutput =
  NonNullable<TRPCOutputs>["stripe"]["createStripeSubscription"];
export type CreateBillingPortalSessionInput =
  NonNullable<TRPCInputs>["stripe"]["createBillingPortalSession"];
export type CreateBillingPortalSessionOutput =
  NonNullable<TRPCOutputs>["stripe"]["createBillingPortalSession"];
// ======================================================================================================
// SUBSCRIPTIONS TYPES
// ======================================================================================================
// Create Subscription
export type CreateSubscriptionInput =
  NonNullable<TRPCInputs>["subscription"]["createSubscription"];
export type CreateSubscriptionOutput =
  NonNullable<TRPCOutputs>["subscription"]["createSubscription"];

// Get Subscription
export type GetSubscriptionInput =
  NonNullable<TRPCInputs>["subscription"]["getSubscription"];
export type GetSubscriptionOutput =
  NonNullable<TRPCOutputs>["subscription"]["getSubscription"];

// ======================================================================================================
// PLANS
// ======================================================================================================

// By Id
export type PlanById = NonNullable<TRPCOutputs>["plans"]["getById"];

// ======================================================================================================
// EMPLOYEES
// ======================================================================================================
// Create Employee
export type CreateEmployeeInput =
  NonNullable<TRPCInputs>["employees"]["createEmployee"];
export type CreateEmployeeOutput =
  NonNullable<TRPCOutputs>["employees"]["createEmployee"];
