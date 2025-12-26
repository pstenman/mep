import { PrepType } from "@mep/types";
import { z } from "zod";

export const templateFormSchema = (t: (key: string) => string) =>
  z.object({
    name: z.string().min(1, t("form.validation.required")),
    prepTypes: z.enum(Object.values(PrepType)),
    groups: z.array(
      z.object({
        name: z.string().min(1, t("form.validation.required")),
        note: z.string().optional(),
        items: z.array(
          z.object({
            name: z.string().min(1, t("form.validation.required")),
            recipeId: z.uuid().optional(),
          }),
        ),
      }),
    ),
  });

export type TemplateFormSchema = z.infer<ReturnType<typeof templateFormSchema>>;
