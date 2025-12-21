import { StripeSubscriptionService } from "@/services/stripe-subscriptions/service";
import { publicProcedure } from "@/trpc/procedures";
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
});
