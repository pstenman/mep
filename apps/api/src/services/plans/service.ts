import { planQueries } from "@mep/db";
import type { CreatePlanSchema } from "./schema";

export class PlanService {
  static async getDefault(locale: string = "en") {
    const plan = await planQueries.getDefault();

    if (!plan) {
      return null;
    }

    const selectedTranslation =
      plan.translations.find((t) => t.locale === locale) ??
      plan.translations.find((t) => t.locale === "en") ??
      plan.translations[0];

    return {
      ...plan,
      selectedTranslation,
    };
  }

  static getById(id: string) {
    return planQueries.getById(id);
  }

  static async create(
    data: CreatePlanSchema & {
      translations?: { locale: string; name: string; description: string }[];
    },
  ) {
    return planQueries.create(data);
  }

  static async update(
    id: string,
    data: Partial<CreatePlanSchema> & {
      translations?: { locale: string; name: string; description: string }[];
    },
  ) {
    return planQueries.update(id, data);
  }

  static async delete(id: string) {
    return planQueries.delete(id);
  }
}
