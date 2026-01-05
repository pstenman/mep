import { defineConfig } from "drizzle-kit";

if (!process.env.DATABASE_DIRECT_URL) {
  throw new Error("DATABASE_DIRECT_URL is required for migrations");
}

export default defineConfig({
  schema: "./src/schema/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  extensionsFilters: ["postgis"],
  dbCredentials: {
    url: process.env.DATABASE_DIRECT_URL,
  },
});
