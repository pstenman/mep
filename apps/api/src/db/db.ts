import { createDb } from "@mep/db";
import postrgres from "postgres";

const connectionString = process.env.DATABASE_URL;

const isLocal = connectionString
  ? connectionString.includes("localhost") ||
    connectionString.includes("127.0.0.1")
  : false;
const sslConfig = isLocal ? false : "require";

const client = postrgres(connectionString!, {
  ssl: sslConfig,
  max: 1,
  idle_timeout: 20,
  connect_timeout: 10,
});
export const db = createDb(client);
export type Database = typeof db;