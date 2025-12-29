import { PrepType } from "@mep/types";
import { z } from "zod";

const prepItemTemplateSchema = z.object({
  name: z.string().min(1),
  recipeId: z.uuid().optional(),
});

const prepGroupTemplateSchema = z.object({
  name: z.string().min(1),
  note: z.string().optional(),
  items: z.array(prepItemTemplateSchema),
});

export const createTemplateSchema = z.object({
  name: z.string().min(1),
  menuId: z.uuid().optional(),
  prepTypes: z.enum(Object.values(PrepType) as [PrepType, ...PrepType[]]),
  groups: z.array(prepGroupTemplateSchema).optional(),
});

export const updateTemplateSchema = z.object({
  id: z.uuid(),
  name: z.string().min(1).optional(),
  menuId: z.uuid().optional().nullable(),
  prepTypes: z
    .enum(Object.values(PrepType) as [PrepType, ...PrepType[]])
    .optional(),
});

export const templateFiltersSchema = z.object({
  search: z.string().optional(),
  prepType: z
    .enum(Object.values(PrepType) as [PrepType, ...PrepType[]])
    .optional(),
});

export type CreateTemplateSchema = z.infer<typeof createTemplateSchema>;
export type UpdateTemplateSchema = z.infer<typeof updateTemplateSchema>;
export type TemplateFiltersSchema = z.infer<typeof templateFiltersSchema>;
