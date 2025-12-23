import {
  prepGroupFiltersSchema,
  createPrepGroupSchema,
  updatePrepGroupSchema,
} from "@/services/prep-groups/schema";
import { PrepGroupService } from "@/services/prep-groups/service";
import {
  prepItemFiltersSchema,
  createPrepItemSchema,
  updatePrepItemSchema,
} from "@/services/prep-items/schema";
import { PrepItemService } from "@/services/prep-items/service";
import { companyProcedure } from "@/trpc/procedures";
import { createTRPCRouter } from "@/trpc/server";
import { z } from "zod";

export const preparationsRouter = createTRPCRouter({
  prepGroups: {
    getAll: companyProcedure
      .input(
        z.object({
          filter: prepGroupFiltersSchema.optional(),
        }).partial(),
      )
      .query(async ({ input, ctx }) => {
        const result = await PrepGroupService.getAll(ctx.companyId!, input);
        return { data: result };
      }),

    getById: companyProcedure
      .input(z.object({ id: z.uuid() }))
      .query(async ({ input }) => {
        const prepGroup = await PrepGroupService.getById(input.id);
        return { data: prepGroup };
      }),

    create: companyProcedure
      .input(createPrepGroupSchema)
      .mutation(async ({ input, ctx }) => {
        const prepGroup = await PrepGroupService.create(input, ctx.companyId!, ctx.userId!);
        return { data: prepGroup };
      }),

    update: companyProcedure
      .input(updatePrepGroupSchema)
      .mutation(async ({ input, ctx }) => {
        const prepGroup = await PrepGroupService.update(input, ctx.userId!);
        return { data: prepGroup };
      }),

    delete: companyProcedure
      .input(z.object({ id: z.uuid() }))
      .mutation(async ({ input, ctx }) => {
        const result = await PrepGroupService.delete(input.id, ctx.companyId!);
        return { data: result };
      }),
  },

  prepItems: {
    getAll: companyProcedure
      .input(
        z.object({
          filter: prepItemFiltersSchema.optional(),
        }).partial(),
      )
      .query(async ({ input, ctx }) => {
        const result = await PrepItemService.getAll(ctx.companyId!, input);
        return { data: result };
      }),

    getById: companyProcedure
      .input(z.object({ id: z.uuid() }))
      .query(async ({ input }) => {
        const prepItem = await PrepItemService.getById(input.id);
        return { data: prepItem };
      }),

    create: companyProcedure
      .input(createPrepItemSchema)
      .mutation(async ({ input, ctx }) => {
        const prepItem = await PrepItemService.create(input, ctx.companyId!, ctx.userId!);
        return { data: prepItem };
      }),

    update: companyProcedure
      .input(updatePrepItemSchema)
      .mutation(async ({ input, ctx }) => {
        const prepItem = await PrepItemService.update(input, ctx.userId!);
        return { data: prepItem };
      }),

    delete: companyProcedure
      .input(z.object({ id: z.uuid() }))
      .mutation(async ({ input, ctx }) => {
        const result = await PrepItemService.delete(input.id, ctx.companyId!);
        return { data: result };
      }),
  },
});

