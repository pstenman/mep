import { drizzle } from "drizzle-orm/postgres-js";
import type { Sql } from "postgres";
import * as schema from "./schema/schema";

export { schema };

export function createDb(client: Sql) {
  return drizzle(client, { schema });
}

export type Db = 
  | ReturnType<typeof createDb>
  | Parameters<Parameters<ReturnType<typeof createDb>["transaction"]>[0]>[0];