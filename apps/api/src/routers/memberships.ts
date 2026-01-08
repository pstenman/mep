import { OwnershipTransferService } from "@/services/memberships/transfer-service";
import { SubscriptionCancellationService } from "@/services/subscription/cancellation-service";
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
      const result = await OwnershipTransferService.transferOwnership(
        input.companyId,
        ctx.userId,
        input.toUserId,
      );
      return { data: result };
    }),

  getOwners: ownerProcedure
    .input(z.object({ companyId: z.uuid() }))
    .query(async ({ input }) => {
      const owners = await OwnershipTransferService.getOwners(input.companyId);
      return { data: owners };
    }),

  cancelSubscription: ownerProcedure
    .input(z.object({ companyId: z.uuid() }))
    .mutation(async ({ input, ctx }) => {
      const result =
        await SubscriptionCancellationService.cancelSubscriptionForUser(
          ctx.userId,
          input.companyId,
        );
      return { data: result };
    }),

  checkSubscriptionStatus: protectedProcedure
    .input(z.object({ companyId: z.uuid() }))
    .query(async ({ input }) => {
      const status =
        await SubscriptionCancellationService.checkSubscriptionStatus(
          input.companyId,
        );
      return { data: status };
    }),

  syncSubscription: ownerProcedure
    .input(z.object({ companyId: z.uuid() }))
    .mutation(async ({ input }) => {
      const result =
        await SubscriptionCancellationService.syncSubscriptionFromStripe(
          input.companyId,
        );
      return { data: result };
    }),
});
