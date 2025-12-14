import { stripeRouter } from "@/routers/stripe";
import { createTRPCRouter } from "./server";
import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";

export const appRouter = createTRPCRouter({
  stripe: stripeRouter,
});

export type AppRouter = typeof appRouter;
export type TRPCInputs = inferRouterInputs<AppRouter>;
export type TRPCOutputs = inferRouterOutputs<AppRouter>;