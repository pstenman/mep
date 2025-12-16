import { PlanInterval } from "@mep/types";
import { z } from "zod";

export const planSchema = z.object({
  name: z.string(),
  description: z.string(),
  price: z.number().int(),
  interval: z.enum(PlanInterval),
  stripePriceId: z.string(),
});

export const plansSchema = z.array(planSchema);

export type CreatePlanSchema = z.infer<typeof planSchema>;
