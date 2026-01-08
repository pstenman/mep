import {
  createAllergySchema,
  updateAllergySchema,
} from "@/services/allergies/schema";
import { AllergyService } from "@/services/allergies/service";
import { companyProcedure } from "@/trpc/procedures";
import { createTRPCRouter } from "@/trpc/server";
import { z } from "zod";

export const allergiesRouter = createTRPCRouter({
  getAll: companyProcedure
    .input(
      z
        .object({
          search: z.string().optional(),
        })
        .optional(),
    )
    .query(async ({ input }) => {
      const result = await AllergyService.getAll(input?.search);
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
      const allergy = await AllergyService.create(input, ctx.userId);
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
