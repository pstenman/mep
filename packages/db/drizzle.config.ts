import { defineConfig } from "drizzle-kit";

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL environment variable is required. Please set it in your .env.local or environment variables.\n" +
      "Example: DATABASE_URL=postgresql://postgres:username:password@localhost:5432/mep_db",
  );
}

export default defineConfig({
  schema: "./src/schema/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  verbose: true,
  strict: true,
});