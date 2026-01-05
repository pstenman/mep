import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "./schema/schema";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

const client = postgres(connectionString, {
  max: 10,
  prepare: false,
  idle_timeout: 20,
  connect_timeout: 30,
  transform: { undefined: null },
});

export const db = drizzle(client, { schema });

export type DBTransaction = Parameters<typeof db.transaction>[0] extends (
  tx: infer T,
) => any
  ? T
  : never;

export type Database = typeof db | DBTransaction;

export * from "./queries/queries";
export * from "./schema/schema";
