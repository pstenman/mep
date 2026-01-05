import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema/schema";

let connectionString = process.env.DATABASE_URL!;

if (!connectionString) {
  throw new Error(
    "DATABASE_URL environment variable is not set. Please configure it in Railway.",
  );
}

const isLocal = connectionString
  ? connectionString.includes("localhost") ||
    connectionString.includes("127.0.0.1")
  : false;

if (!isLocal && !connectionString.includes("sslmode=")) {
  const separator = connectionString.includes("?") ? "&" : "?";
  connectionString = `${connectionString}${separator}sslmode=require`;
}

const sslConfig = isLocal ? false : "require";

if (!isLocal) {
  const url = new URL(connectionString);
  console.log(
    `🔌 Connecting to database: ${url.hostname}:${url.port || 5432} (SSL: ${sslConfig})`,
  );
}

const client = postgres(connectionString, {
  ssl: sslConfig,
  max: 10,
  idle_timeout: 20,
  connect_timeout: 30,
  onnotice: () => {},
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
