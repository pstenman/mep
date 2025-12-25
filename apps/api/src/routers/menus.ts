import {
  menuFiltersSchema,
  createMenuSchema,
  updateMenuSchema,
} from "@/services/menus/schema";
import { MenuService } from "@/services/menus/service";
import { companyProcedure } from "@/trpc/procedures";
import { createTRPCRouter } from "@/trpc/server";
import { z } from "zod";

export const menusRouter = createTRPCRouter({
  getAll: companyProcedure
    .input(
      z.object({
        filter: menuFiltersSchema.optional(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const result = await MenuService.getAll(ctx.companyId!, input);
      return { data: result };
    }),

  getById: companyProcedure
    .input(z.object({ id: z.uuid() }))
    .query(async ({ input }) => {
      const menu = await MenuService.getById(input.id);
      return { data: menu };
    }),

  create: companyProcedure
    .input(createMenuSchema)
    .mutation(async ({ input, ctx }) => {
      const menu = await MenuService.create(input, ctx.companyId!, ctx.userId!);
      return { data: menu };
    }),

  update: companyProcedure
    .input(updateMenuSchema)
    .mutation(async ({ input, ctx }) => {
      const menu = await MenuService.update(input, ctx.userId!);
      return { data: menu };
    }),

  delete: companyProcedure
    .input(z.object({ id: z.uuid() }))
    .mutation(async ({ input, ctx }) => {
      const result = await MenuService.delete(input.id, ctx.companyId!);
      return { data: result };
    }),
});
