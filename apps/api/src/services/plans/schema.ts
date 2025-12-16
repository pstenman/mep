import { PlanInterval } from "@mep/types";
import { z } from "zod";

export const planTranslationSchema = z.object({
  locale: z.string().min(2),
  name: z.string(),
  description: z.string(),
});

export const planSchema = z.object({
  price: z.number().int(),
  interval: z.enum(PlanInterval),
  stripePriceId: z.string(),
  translations: z.array(planTranslationSchema).min(1),
});

export const plansSchema = z.array(planSchema);

export type CreatePlanSchema = z.infer<typeof planSchema>;
