import { StripeSubscriptionService } from "@/services/stripe-subscriptions/service";
import { StripeService } from "@/services/stripe/services";
import { ownerProcedure, publicProcedure } from "@/trpc/procedures";
import { createTRPCRouter } from "@/trpc/server";
import { z } from "zod";

export const stripeRouter = createTRPCRouter({
  createStripeSubscription: publicProcedure
    .input(
      z.object({
        email: z.email("Must be a valid email"),
        companyName: z.string().min(1),
        companyRegistrationNumber: z.string().min(1),
        companyId: z.string().min(1),
        membershipId: z.string().min(1),
        userId: z.string().min(1),
      }),
    )
    .mutation(async ({ input }) => {
      const {
        clientSecret,
        customerId,
        subscriptionId,
        subscriptionStatus,
        plan,
        amount,
      } = await StripeSubscriptionService.createStripeSubscription(input);

      return {
        clientSecret,
        customerId,
        subscriptionId,
        subscriptionStatus,
        plan,
        amount,
      };
    }),

  createBillingPortalSession: ownerProcedure
    .input(
      z.object({
        customerId: z.string(),
        returnUrl: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const session = await StripeService.createBillingPortalSession(
        input.customerId,
        input.returnUrl,
      );
      return { url: session.url };
    }),
});
