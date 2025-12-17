import { eq } from "drizzle-orm";
import { plans, planTranslations } from "../schema/plans";
import type {
  CreatePlanInput,
  Plan,
  PlanInterval,
  UpdatePlanInput,
} from "@mep/types";
import { logger } from "@mep/api";
import { db } from "..";

type PlanRow = typeof plans.$inferSelect;
type PlanInsert = typeof plans.$inferInsert;

export const mapPlan = (
  row: PlanRow,
  translations: Array<{
    locale: string;
    name: string;
    description: string;
  }> = [],
): Plan => ({
  id: row.id,
  price: row.price,
  interval: row.interval as PlanInterval,
  stripePriceId: row.stripePriceId,
  translations,
});

export const planQueries = {
  getDefault: async () => {
    const plan = await db.query.plans.findFirst({
      with: { translations: true },
      orderBy: (p, { asc }) => asc(p.id),
    });
    return plan ?? null;
  },

  getById: async (id: string) => {
    const row = await db.query.plans.findFirst({
      where: eq(plans.id, id),
      with: { translations: true },
    });

    if (!row) return null;

    return mapPlan(
      row,
      row.translations.map((t) => ({
        locale: t.locale,
        name: t.name,
        description: t.description,
      })),
    );
  },

  create: async (input: CreatePlanInput) => {
    const { translations, ...planData } = input;

    const [row] = await db
      .insert(plans)
      .values(planData satisfies PlanInsert)
      .returning();

    await db.insert(planTranslations).values(
      translations.map((t) => ({
        planId: row.id,
        locale: t.locale,
        name: t.name,
        description: t.description,
      })),
    );

    return mapPlan(row, translations);
  },

  update: async (id: string, input: UpdatePlanInput) => {
    const { translations, ...planData } = input;

    const [row] = await db
      .update(plans)
      .set(planData)
      .where(eq(plans.id, id))
      .returning();

    if (!row) return null;

    if (translations) {
      for (const t of translations) {
        await db
          .insert(planTranslations)
          .values({ planId: id, ...t })
          .onConflictDoUpdate({
            target: [planTranslations.planId, planTranslations.locale],
            set: {
              name: t.name,
              description: t.description,
            },
          });
      }
    }

    return mapPlan(row, translations ?? []);
  },

  delete: async (id: string) => {
    await db.delete(planTranslations).where(eq(planTranslations.planId, id));

    const [row] = await db.delete(plans).where(eq(plans.id, id)).returning();

    return row ? mapPlan(row) : null;
  },
};
