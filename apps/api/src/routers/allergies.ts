import {
  createAllergySchema,
  updateAllergySchema,
} from "@/services/allergies/schema";
import { AllergyService } from "@/services/allergies/service";
import { companyProcedure } from "@/trpc/procedures";
import { createTRPCRouter } from "@/trpc/server";
import { z } from "zod";

export const allergiesRouter = createTRPCRouter({
  getAll: companyProcedure.query(async ({ ctx }) => {
    const result = await AllergyService.getAll(ctx.companyId);
    return { data: result };
  }),

  getById: companyProcedure
    .input(z.object({ id: z.uuid() }))
    .query(async ({ input }) => {
      const allergy = await AllergyService.getById(input.id);
      return { data: allergy };
    }),

  create: companyProcedure
    .input(createAllergySchema)
    .mutation(async ({ input, ctx }) => {
      const allergy = await AllergyService.create(
        input,
        ctx.companyId,
        ctx.userId,
      );
      return { data: allergy };
    }),

  update: companyProcedure
    .input(updateAllergySchema)
    .mutation(async ({ input, ctx }) => {
      const allergy = await AllergyService.update(input, ctx.userId);
      return { data: allergy };
    }),

  delete: companyProcedure
    .input(z.object({ id: z.uuid() }))
    .mutation(async ({ input }) => {
      const result = await AllergyService.delete(input.id);
      return { data: result };
    }),
});
