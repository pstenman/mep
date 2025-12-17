export type PlanTranslation = {
  locale: string;
  name: string;
  description: string;
};

export enum PlanInterval {
  YEAR = "year",
  MONTH = "month",
  QUARTER = "quarter",
}

export type Plan = {
  id: string;
  price: number;
  interval: PlanInterval;
  stripePriceId: string;
  translations: PlanTranslation[];
};

export type CreatePlanInput = {
  price: number;
  interval: PlanInterval;
  stripePriceId: string;
  translations: PlanTranslation[];
};

export type UpdatePlanInput = Partial<CreatePlanInput>;
