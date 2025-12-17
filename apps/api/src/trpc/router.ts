import { stripeRouter } from "@/routers/stripe";
import { createTRPCRouter } from "./server";
import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";
import { authRouter } from "@/routers/auth";
import { planRouter } from "@/routers/plans";

export const appRouter = createTRPCRouter({
  stripe: stripeRouter,
  auth: authRouter,
  plans: planRouter,
});

export type AppRouter = typeof appRouter;
export type TRPCInputs = inferRouterInputs<AppRouter>;
export type TRPCOutputs = inferRouterOutputs<AppRouter>;
