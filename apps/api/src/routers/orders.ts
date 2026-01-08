import {
  orderFiltersSchema,
  createOrderSchema,
  updateOrderSchema,
} from "@/services/orders/schema";
import { OrderService } from "@/services/orders/service";
import { companyProcedure } from "@/trpc/procedures";
import { createTRPCRouter } from "@/trpc/server";
import { z } from "zod";
import type { OrderFilters } from "@mep/db";

export const ordersRouter = createTRPCRouter({
  getAll: companyProcedure
    .input(
      z
        .object({
          filter: orderFiltersSchema.optional(),
        })
        .partial(),
    )
    .query(async ({ input, ctx }) => {
      const filters: OrderFilters = {
        companyId: ctx.companyId!,
      };
      if (input?.filter?.orderDate) {
        filters.orderDate = input.filter.orderDate;
      }
      const result = await OrderService.getAll(ctx.companyId!, filters);
      return { data: result };
    }),

  getById: companyProcedure
    .input(z.object({ id: z.uuid() }))
    .query(async ({ input }) => {
      const order = await OrderService.getById(input.id);
      return { data: order };
    }),

  getByDate: companyProcedure
    .input(z.object({ orderDate: z.coerce.date() }))
    .query(async ({ input, ctx }) => {
      const order = await OrderService.getByDate(
        ctx.companyId!,
        input.orderDate,
      );
      return { data: order };
    }),

  create: companyProcedure
    .input(createOrderSchema)
    .mutation(async ({ input, ctx }) => {
      const order = await OrderService.create(
        input,
        ctx.companyId!,
        ctx.userId!,
      );
      return { data: order };
    }),

  update: companyProcedure
    .input(updateOrderSchema)
    .mutation(async ({ input, ctx }) => {
      const order = await OrderService.update(input, ctx.userId!);
      return { data: order };
    }),

  delete: companyProcedure
    .input(z.object({ id: z.uuid() }))
    .mutation(async ({ input, ctx }) => {
      const result = await OrderService.delete(input.id, ctx.companyId!);
      return { data: result };
    }),
});
