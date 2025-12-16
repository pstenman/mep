import { eq } from "drizzle-orm";
import { plans, planTranslations } from "../schema/plans";
import type { Db } from "../index";
import type { PlanInterval } from "@mep/types";

export type PlanTranslation = {
  locale: string;
  name: string;
  description: string;
};

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

type PlanRow = typeof plans.$inferSelect;
type PlanInsert = typeof plans.$inferInsert;

const mapPlan = (row: PlanRow, translations: PlanTranslation[] = []): Plan => ({
  id: row.id,
  price: row.price,
  interval: row.interval as PlanInterval,
  stripePriceId: row.stripePriceId,
  translations,
});

export const planQueries = {
  list: async (db: Db): Promise<Plan[]> => {
    const rows = await db.query.plans.findMany({
      with: { translations: true },
    });

    return rows.map((row) =>
      mapPlan(
        row,
        row.translations.map((t) => ({
          locale: t.locale,
          name: t.name,
          description: t.description,
        })),
      ),
    );
  },

  getById: async (db: Db, id: string): Promise<Plan | null> => {
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

  create: async (db: Db, input: CreatePlanInput) => {
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

  update: async (db: Db, id: string, input: UpdatePlanInput) => {
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

  delete: async (db: Db, id: string): Promise<Plan | null> => {
    await db.delete(planTranslations).where(eq(planTranslations.planId, id));

    const [row] = await db.delete(plans).where(eq(plans.id, id)).returning();

    return row ? mapPlan(row) : null;
  },
};
