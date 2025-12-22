import type { TRPCInputs, TRPCOutputs } from "@/trpc/router";

// ======================================================================================================
// STRIPE TYPES
// ======================================================================================================

// Create 
export type CreateStripeSubscriptionInput =
  NonNullable<TRPCInputs>["stripe"]["createStripeSubscription"];
export type CreateStripeSubscriptionOutput =
  NonNullable<TRPCOutputs>["stripe"]["createStripeSubscription"];

// Create Billing Portal Session
export type CreateBillingPortalSessionInput =
  NonNullable<TRPCInputs>["stripe"]["createBillingPortalSession"];
export type CreateBillingPortalSessionOutput =
  NonNullable<TRPCOutputs>["stripe"]["createBillingPortalSession"];

// By Id
export type PlanById = NonNullable<TRPCOutputs>["plans"]["getById"];
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
// USERS
// ======================================================================================================

// Get All
export type UsersInput =
  NonNullable<TRPCInputs>["users"]["getAll"];
export type UsersOutput =
  NonNullable<TRPCOutputs>["users"]["getAll"];

// Get By Id
export type UserInput =
  NonNullable<TRPCInputs>["users"]["getById"];
export type UserOutput =
  NonNullable<TRPCOutputs>["users"]["getById"];

// Get By Email
export type GetUserByEmailInput =
  NonNullable<TRPCInputs>["users"]["getByEmail"];
export type GetUserByEmailOutput =
  NonNullable<TRPCOutputs>["users"]["getByEmail"];

// Create
export type CreateUserInput =
  NonNullable<TRPCInputs>["users"]["create"];
export type CreateUserOutput =
  NonNullable<TRPCOutputs>["users"]["create"];
