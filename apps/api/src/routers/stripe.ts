import { StripeService } from "@/services/stripe/service";
import { publicProcedure } from "@/trpc/procedures";
import { createTRPCRouter } from "@/trpc/server";
import { z } from "zod";

export const stripeRouter = createTRPCRouter({
  createSetupIntent: publicProcedure
    .input(
      z.object({
        firstName: z.string().min(1),
        lastName: z.string().min(1),
        email: z.email("Must be a valid email"),
        companyName: z.string().min(1)
      })
    )
    .mutation(async({ input }) => {
      const { clientSecret, customerId } =
        await StripeService.createCustomerAndSetupIntent(input);
      
      return {
        clientSecret,
        customerId
      };
    }),
});