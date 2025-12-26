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
import {
  prepListFiltersSchema,
  createPrepListSchema,
  updatePrepListSchema,
} from "@/services/prep-list/schema";
import { PrepListService } from "@/services/prep-list/service";
import { companyProcedure } from "@/trpc/procedures";
import { createTRPCRouter } from "@/trpc/server";
import { PrepType } from "@mep/types";
import { z } from "zod";

export const preparationsRouter = createTRPCRouter({
  prepLists: {
    getAll: companyProcedure
      .input(
        z
          .object({
            filter: prepListFiltersSchema.optional(),
          })
          .partial(),
      )
      .query(async ({ input, ctx }) => {
        const result = await PrepListService.getAll(ctx.companyId!, input);
        return { data: result };
      }),

    getById: companyProcedure
      .input(z.object({ id: z.uuid() }))
      .query(async ({ input, ctx }) => {
        const prepList = await PrepListService.getById(
          input.id,
          ctx.companyId!,
        );
        return { data: prepList };
      }),

    getActive: companyProcedure
      .input(
        z
          .object({
            prepType: z.enum(Object.values(PrepType)).optional(),
          })
          .optional(),
      )
      .query(async ({ input, ctx }) => {
        const prepList = await PrepListService.getActive(
          ctx.companyId!,
          input?.prepType,
        );
        return { data: prepList };
      }),

    createTemplate: companyProcedure
      .input(createPrepListSchema)
      .mutation(async ({ input, ctx }) => {
        const prepList = await PrepListService.createTemplate(
          input,
          ctx.companyId!,
          ctx.userId!,
        );
        return { data: prepList };
      }),

    update: companyProcedure
      .input(updatePrepListSchema)
      .mutation(async ({ input, ctx }) => {
        const prepList = await PrepListService.update(
          input,
          ctx.companyId!,
          ctx.userId!,
        );
        return { data: prepList };
      }),

    delete: companyProcedure
      .input(z.object({ id: z.uuid() }))
      .mutation(async ({ input, ctx }) => {
        const result = await PrepListService.delete(input.id, ctx.companyId!);
        return { data: result };
      }),

    createFromTemplate: companyProcedure
      .input(
        z.object({
          prepType: z.enum(Object.values(PrepType)),
          date: z.coerce.date(),
        }),
      )
      .mutation(async ({ input, ctx }) => {
        const prepList = await PrepListService.createFromTemplate(
          ctx.companyId!,
          input.prepType,
          input.date,
          ctx.userId!,
        );
        return { data: prepList };
      }),

    setActive: companyProcedure
      .input(z.object({ id: z.uuid() }))
      .mutation(async ({ input, ctx }) => {
        const prepList = await PrepListService.setActive(
          input.id,
          ctx.companyId!,
          ctx.userId!,
        );
        return { data: prepList };
      }),
  },

  prepGroups: {
    getAll: companyProcedure
      .input(
        z
          .object({
            filter: prepGroupFiltersSchema.optional(),
          })
          .partial(),
      )
      .query(async ({ input, ctx }) => {
        const result = await PrepGroupService.getAll(ctx.companyId!, input);
        return { data: result };
      }),

    getById: companyProcedure
      .input(z.object({ id: z.uuid() }))
      .query(async ({ input, ctx }) => {
        const prepGroup = await PrepGroupService.getById(
          input.id,
          ctx.companyId!,
        );
        return { data: prepGroup };
      }),

    create: companyProcedure
      .input(createPrepGroupSchema)
      .mutation(async ({ input, ctx }) => {
        const prepGroup = await PrepGroupService.create(
          input,
          ctx.companyId!,
          ctx.userId!,
        );
        return { data: prepGroup };
      }),

    update: companyProcedure
      .input(updatePrepGroupSchema)
      .mutation(async ({ input, ctx }) => {
        const prepGroup = await PrepGroupService.update(
          input,
          ctx.companyId!,
          ctx.userId!,
        );
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
        z
          .object({
            filter: prepItemFiltersSchema.optional(),
          })
          .partial(),
      )
      .query(async ({ input, ctx }) => {
        const result = await PrepItemService.getAll(ctx.companyId!, input);
        return { data: result };
      }),

    getById: companyProcedure
      .input(z.object({ id: z.string().uuid() }))
      .query(async ({ input, ctx }) => {
        const prepItem = await PrepItemService.getById(
          input.id,
          ctx.companyId!,
        );
        return { data: prepItem };
      }),

    create: companyProcedure
      .input(createPrepItemSchema)
      .mutation(async ({ input, ctx }) => {
        const prepItem = await PrepItemService.create(
          input,
          ctx.companyId!,
          ctx.userId!,
        );
        return { data: prepItem };
      }),

    update: companyProcedure
      .input(updatePrepItemSchema)
      .mutation(async ({ input, ctx }) => {
        const prepItem = await PrepItemService.update(
          input,
          ctx.companyId!,
          ctx.userId!,
        );
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
