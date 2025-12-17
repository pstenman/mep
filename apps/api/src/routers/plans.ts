import { PlanService } from "@/services/plans/service";
import { publicProcedure } from "@/trpc/procedures";
import { createTRPCRouter } from "@/trpc/server";
import { logger } from "@/utils/logger";
import { PlanInterval } from "@mep/types";
import z from "zod";

export const planRouter = createTRPCRouter({
getDefault: publicProcedure
  .input(z.object({ locale: z.string().optional() }))
  .query(async ({ input }) => {
    const plan = await PlanService.getDefault( input.locale);

    return { data: plan ?? null };
  }),

  getById: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ input }) => {
      const plan = await PlanService.getById(input.id); // antag att service nu hanterar db
      return { data: plan };
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
    .mutation(async ({ input }) => {
      return PlanService.create(input); // db hanteras internt i service
    }),
});
