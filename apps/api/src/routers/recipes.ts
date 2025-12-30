import {
  recipeFiltersSchema,
  createRecipeSchema,
  updateRecipeSchema,
} from "@/services/recipes/schema";
import { RecipeService } from "@/services/recipes/service";
import { companyProcedure } from "@/trpc/procedures";
import { createTRPCRouter } from "@/trpc/server";
import { z } from "zod";

export const recipesRouter = createTRPCRouter({
  getAll: companyProcedure
    .input(
      z
        .object({
          filter: recipeFiltersSchema.optional(),
        })
        .partial(),
    )
    .query(async ({ input, ctx }) => {
      const result = await RecipeService.getAll(ctx.companyId!, input);
      return { data: result };
    }),

  getById: companyProcedure
    .input(z.object({ id: z.uuid() }))
    .query(async ({ input }) => {
      const recipe = await RecipeService.getById(input.id);
      return { data: recipe };
    }),

  create: companyProcedure
    .input(createRecipeSchema)
    .mutation(async ({ input, ctx }) => {
      const recipe = await RecipeService.create(
        input,
        ctx.companyId!,
        ctx.userId!,
      );
      return { data: recipe };
    }),

  update: companyProcedure
    .input(updateRecipeSchema)
    .mutation(async ({ input, ctx }) => {
      const recipe = await RecipeService.update(input, ctx.userId!);
      return { data: recipe };
    }),

  delete: companyProcedure
    .input(z.object({ id: z.uuid() }))
    .mutation(async ({ input, ctx }) => {
      const result = await RecipeService.delete(input.id, ctx.companyId!);
      return { data: result };
    }),
});
