import { eq } from "drizzle-orm";
import { plans } from "../schema/plans";
import type { Db } from "../index";
import type { PlanInterval } from "@mep/types";

export type Plan = {
  id: string;
  name: string;
  description: string;
  price: number;
  interval: PlanInterval;
  stripePriceId: string;
};

export type PlanCreate = Omit<Plan, "id">;
export type PlanUpdate = Partial<Omit<Plan, "id">>;

const mapPlan = (row: any): Plan => ({
  ...row,
  interval: row.interval as PlanInterval,
});

export const planQueries = {
  list: async (db: Db) => {
    const result = await db.query.plans.findMany();
    return result.map(mapPlan);
  },

  getById: async (db: Db, id: string) => {
    const plan = await db.query.plans.findFirst({ where: eq(plans.id, id) });
    return plan ? mapPlan(plan) : null;
  },

  create: async (db: Db, data: PlanCreate) => {
    const [row] = await db.insert(plans).values(data).returning();
    return row ? mapPlan(row) : null;
  },

  update: async (db: Db, id: string, data: PlanUpdate) => {
    if (!data || Object.keys(data).length === 0) return null;
    const [row] = await db
      .update(plans)
      .set(data)
      .where(eq(plans.id, id))
      .returning();
    return row ? mapPlan(row) : null;
  },

  delete: async (db: Db, id: string) => {
    const [row] = await db.delete(plans).where(eq(plans.id, id)).returning();
    return row ? mapPlan(row) : null;
  },
};
