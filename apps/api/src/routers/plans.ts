import { PlanService } from "@/services/plans/service";
import { publicProcedure } from "@/trpc/procedures";
import { createTRPCRouter } from "@/trpc/server";
import { PlanInterval } from "@mep/types";
import z from "zod";

export const planRouter = createTRPCRouter({
  list: publicProcedure.query(async ({ ctx }) => {
    return PlanService.list(ctx.db);
  }),

  getById: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      return PlanService.getById(ctx.db, input.id);
    }),

  create: publicProcedure
    .input(
      z.object({
        price: z.number().min(0),
        interval: z.enum(PlanInterval),
        stripePriceId: z.string().min(1),
        translations: z.array(
          z.object({
            locale: z.string().min(2),
            name: z.string().min(1),
            description: z.string().min(1),
          }),
        ),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return PlanService.create(ctx.db, input);
    }),
});
