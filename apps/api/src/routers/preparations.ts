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
  updatePrepListSchema,
} from "@/services/prep-list/schema";
import { PrepListService } from "@/services/prep-list/service";
import {
  createTemplateSchema,
  updateTemplateSchema,
  templateFiltersSchema,
} from "@/services/templates/schema";
import { TemplateService } from "@/services/templates/service";
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
          templateId: z.uuid(),
          scheduleFor: z.coerce.date(),
        }),
      )
      .mutation(async ({ input, ctx }) => {
        const prepList = await PrepListService.createFromTemplate(
          ctx.companyId!,
          input.templateId,
          input.scheduleFor,
          ctx.userId!,
        );
        return { data: prepList };
      }),

    setActive: companyProcedure
      .input(
        z.object({
          id: z.uuid(),
          scheduleFor: z.coerce.date().optional(),
        }),
      )
      .mutation(async ({ input, ctx }) => {
        const prepList = await PrepListService.setActive(
          input.id,
          ctx.companyId!,
          ctx.userId!,
          input.scheduleFor,
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
        const prepGroup = await PrepGroupService.create(input, ctx.companyId!);
        return { data: prepGroup };
      }),

    update: companyProcedure
      .input(updatePrepGroupSchema)
      .mutation(async ({ input, ctx }) => {
        const prepGroup = await PrepGroupService.update(input, ctx.companyId!);
        return { data: prepGroup };
      }),

    delete: companyProcedure
      .input(z.object({ id: z.uuid() }))
      .mutation(async ({ input, ctx }) => {
        const result = await PrepGroupService.delete(input.id, ctx.companyId!);
        return { data: result };
      }),

    addNote: companyProcedure
      .input(
        z.object({
          prepGroupId: z.uuid(),
          message: z.string().min(1).max(500),
        }),
      )
      .mutation(async ({ input, ctx }) => {
        const prepGroup = await PrepGroupService.addNote(
          input.prepGroupId,
          input.message,
          ctx.userId!,
          ctx.companyId!,
        );
        return { data: prepGroup };
      }),

    deleteNote: companyProcedure
      .input(
        z.object({
          prepGroupId: z.uuid(),
          noteId: z.uuid(),
        }),
      )
      .mutation(async ({ input, ctx }) => {
        const prepGroup = await PrepGroupService.deleteNote(
          input.prepGroupId,
          input.noteId,
          ctx.companyId!,
        );
        return { data: prepGroup };
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
        const prepItem = await PrepItemService.create(input, ctx.companyId!);
        return { data: prepItem };
      }),

    update: companyProcedure
      .input(updatePrepItemSchema)
      .mutation(async ({ input, ctx }) => {
        const prepItem = await PrepItemService.update(input, ctx.companyId!);
        return { data: prepItem };
      }),

    delete: companyProcedure
      .input(z.object({ id: z.uuid() }))
      .mutation(async ({ input, ctx }) => {
        const result = await PrepItemService.delete(input.id, ctx.companyId!);
        return { data: result };
      }),
  },

  templates: {
    getAll: companyProcedure
      .input(
        z
          .object({
            filter: templateFiltersSchema.optional(),
          })
          .partial(),
      )
      .query(async ({ input, ctx }) => {
        const result = await TemplateService.getAll(ctx.companyId!, input);
        return { data: result };
      }),

    getById: companyProcedure
      .input(z.object({ id: z.uuid() }))
      .query(async ({ input, ctx }) => {
        const template = await TemplateService.getById(
          input.id,
          ctx.companyId!,
        );
        return { data: template };
      }),

    getActive: companyProcedure
      .input(
        z.object({
          prepType: z.enum(Object.values(PrepType)),
        }),
      )
      .query(async ({ input, ctx }) => {
        const template = await TemplateService.getActive(
          ctx.companyId!,
          input.prepType,
        );
        return { data: template };
      }),

    create: companyProcedure
      .input(createTemplateSchema)
      .mutation(async ({ input, ctx }) => {
        const template = await TemplateService.createTemplate(
          input,
          ctx.companyId!,
          ctx.userId!,
        );
        return { data: template };
      }),

    update: companyProcedure
      .input(updateTemplateSchema)
      .mutation(async ({ input, ctx }) => {
        const template = await TemplateService.update(
          input,
          ctx.companyId!,
          ctx.userId!,
        );
        return { data: template };
      }),

    delete: companyProcedure
      .input(z.object({ id: z.uuid() }))
      .mutation(async ({ input, ctx }) => {
        const result = await TemplateService.delete(input.id, ctx.companyId!);
        return { data: result };
      }),

    setActive: companyProcedure
      .input(
        z.object({
          id: z.uuid(),
          prepType: z.enum(Object.values(PrepType)),
        }),
      )
      .mutation(async ({ input, ctx }) => {
        const template = await TemplateService.setActive(
          input.id,
          ctx.companyId!,
          input.prepType,
        );
        return { data: template };
      }),
  },
});
