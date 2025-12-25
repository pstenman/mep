import {
  menuItemFiltersSchema,
  createMenuItemSchema,
  updateMenuItemSchema,
} from "@/services/menu-items/schema";
import { MenuItemService } from "@/services/menu-items/service";
import { companyProcedure } from "@/trpc/procedures";
import { createTRPCRouter } from "@/trpc/server";
import { z } from "zod";

export const menuItemsRouter = createTRPCRouter({
  getAll: companyProcedure
    .input(
      z
        .object({
          filter: menuItemFiltersSchema.optional(),
        })
        .partial(),
    )
    .query(async ({ input, ctx }) => {
      const result = await MenuItemService.getAll(ctx.companyId!, input);
      return { data: result.items };
    }),

  getById: companyProcedure
    .input(z.object({ id: z.uuid() }))
    .query(async ({ input }) => {
      const menuItem = await MenuItemService.getById(input.id);
      return { data: menuItem };
    }),

  create: companyProcedure
    .input(createMenuItemSchema)
    .mutation(async ({ input, ctx }) => {
      const menuItem = await MenuItemService.create(
        input,
        ctx.companyId!,
        ctx.userId!,
      );
      return { data: menuItem };
    }),

  update: companyProcedure
    .input(updateMenuItemSchema)
    .mutation(async ({ input, ctx }) => {
      const menuItem = await MenuItemService.update(input, ctx.userId!);
      return { data: menuItem };
    }),

  delete: companyProcedure
    .input(z.object({ id: z.uuid() }))
    .mutation(async ({ input, ctx }) => {
      const result = await MenuItemService.delete(input.id, ctx.companyId!);
      return { data: result };
    }),
});
