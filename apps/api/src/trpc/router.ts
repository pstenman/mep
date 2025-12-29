import { stripeRouter } from "@/routers/stripe";
import { createTRPCRouter } from "./server";
import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";
import { planRouter } from "@/routers/plans";
import { subscriptionRouter } from "@/routers/subscriptions";
import { userRouter } from "@/routers/users";
import { allergiesRouter } from "@/routers/allergies";
import { recipesRouter } from "@/routers/recipes";
import { menusRouter } from "@/routers/menus";
import { menuItemsRouter } from "@/routers/menu-items";
import { ordersRouter } from "@/routers/orders";
import { preparationsRouter } from "@/routers/preparations";
import { companySettingsRouter } from "@/routers/company-settings";

export const appRouter = createTRPCRouter({
  stripe: stripeRouter,
  subscription: subscriptionRouter,
  plans: planRouter,
  users: userRouter,
  allergies: allergiesRouter,
  recipes: recipesRouter,
  menus: menusRouter,
  menuItems: menuItemsRouter,
  orders: ordersRouter,
  preparations: preparationsRouter,
  companySettings: companySettingsRouter,
});

export type AppRouter = typeof appRouter;
export type TRPCInputs = inferRouterInputs<AppRouter>;
export type TRPCOutputs = inferRouterOutputs<AppRouter>;
