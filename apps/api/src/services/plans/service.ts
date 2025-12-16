import type { Database } from "@/db/db";
import { queries } from "@mep/db";
import type { CreatePlanSchema } from "./schema";

export class PlanService {
  static list(db: Database) {
    return queries.planQueries.list(db);
  }

  static getById(db: Database, id: string) {
    return queries.planQueries.getById(db, id);
  }

  static async create(
    db: Database,
    data: CreatePlanSchema & {
      translations?: { locale: string; name: string; description: string }[];
    },
  ) {
    return queries.planQueries.create(db, data);
  }

  static async update(
    db: Database,
    id: string,
    data: Partial<CreatePlanSchema> & {
      translations?: { locale: string; name: string; description: string }[];
    },
  ) {
    return queries.planQueries.update(db, id, data);
  }

  static async delete(db: Database, id: string) {
    return queries.planQueries.delete(db, id);
  }
}
