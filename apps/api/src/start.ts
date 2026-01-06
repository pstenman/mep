import "dotenv/config";
import { seedPlans } from "./seed/plans";
import { logger } from "./utils/logger";
import { server } from "./hono/server";

async function start() {
  try {
    logger.info("🌱 Checking/seeding plans...");
    await seedPlans();
    logger.info("✅ Plans ready, starting server...");
  } catch (error) {
    logger.error(
      error,
      "⚠️ Seed check failed (continuing anyway - server will start)",
    );
  }

  Bun.serve(server);
}

start();
