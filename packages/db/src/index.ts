import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema/schema";

const connectionString = process.env.DATABASE_URL!;

const isLocal = connectionString
  ? connectionString.includes("localhost") ||
    connectionString.includes("127.0.0.1")
  : false;
const sslConfig = isLocal ? false : "require";

const client = postgres(connectionString!, {
  ssl: sslConfig,
  max: 1,
  idle_timeout: 0,
  connect_timeout: 10,
});
export const db = drizzle(client, { schema });

export type DBTransaction = Parameters<typeof db.transaction>[0] extends (
  tx: infer T,
) => any
  ? T
  : never;

export type Database = typeof db | DBTransaction;

export * from "./queries/plans";
export * from "./queries/queries";
