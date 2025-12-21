import { stripeRouter } from "@/routers/stripe";
import { createTRPCRouter } from "./server";
import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";
import { planRouter } from "@/routers/plans";
import { subscriptionRouter } from "@/routers/subscriptions";

export const appRouter = createTRPCRouter({
  stripe: stripeRouter,
  subscription: subscriptionRouter,
  plans: planRouter,
});

export type AppRouter = typeof appRouter;
export type TRPCInputs = inferRouterInputs<AppRouter>;
export type TRPCOutputs = inferRouterOutputs<AppRouter>;
