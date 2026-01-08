import { MembershipService } from "@/services/memberships/service";
import { SubscriptionService } from "@/services/subscription/services";
import { ownerProcedure, protectedProcedure } from "@/trpc/procedures";
import { createTRPCRouter } from "@/trpc/server";
import { z } from "zod";

export const membershipRouter = createTRPCRouter({
  transferOwnership: ownerProcedure
    .input(
      z.object({
        companyId: z.uuid(),
        toUserId: z.uuid(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const result = await MembershipService.transferOwnership(
        input.companyId,
        ctx.userId,
        input.toUserId,
      );
      return { data: result };
    }),

  getOwners: ownerProcedure
    .input(z.object({ companyId: z.uuid() }))
    .query(async ({ input }) => {
      const owners = await MembershipService.getOwners(input.companyId);
      return { data: owners };
    }),

  cancelSubscription: ownerProcedure
    .input(z.object({ companyId: z.uuid() }))
    .mutation(async ({ input, ctx }) => {
      const result = await SubscriptionService.cancelSubscriptionForUser(
        ctx.userId,
        input.companyId,
      );
      return { data: result };
    }),

  checkSubscriptionStatus: protectedProcedure
    .input(z.object({ companyId: z.uuid() }))
    .query(async ({ input }) => {
      const status = await SubscriptionService.checkSubscriptionStatus(
        input.companyId,
      );
      return { data: status };
    }),

  syncSubscription: ownerProcedure
    .input(z.object({ companyId: z.uuid() }))
    .mutation(async ({ input }) => {
      const result = await SubscriptionService.syncSubscriptionFromStripe(
        input.companyId,
      );
      return { data: result };
    }),
});
