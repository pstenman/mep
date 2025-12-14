

// ======================================================================================================
// STRIPE TYPES

import type { TRPCInputs, TRPCOutputs } from "@/trpc/router";

// ======================================================================================================
export type CreateSetupIntentInput = NonNullable<TRPCInputs>["stripe"]["createSetupIntent"];
export type CreateSetupIntentOutput = NonNullable<TRPCOutputs>["stripe"]["createSetupIntent"];