import { SubscriptionService } from "@/services/subscription/services";
import { publicProcedure } from "@/trpc/procedures";
import { createTRPCRouter } from "@/trpc/server";
import z from "zod";

export const subscriptionRouter = createTRPCRouter({
  createSubscription: publicProcedure
    .input(
      z.object({
        email: z.email(),
        firstName: z.string().min(1),
        lastName: z.string().min(1),
        companyName: z.string().min(1),
        companyRegistrationNumber: z.string().min(1),
      }),
    )
    .mutation(async ({ input }) => {
      const data = await SubscriptionService.createSubscription(input);

      return {
        userId: data.user.id,
        companyId: data.company.id,
        membershipId: data.membership.id,
      };
    }),
});
