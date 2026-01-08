import { seedPlans } from "./seed/plans";
import { seedAllergies } from "./seed/allergens";
import { logger } from "./utils/logger";
import { server } from "./hono/server";

async function start() {
  try {
    logger.info("🌱 Checking/seeding plans...");
    await seedPlans();
    logger.info("✅ Plans ready");
  } catch (error) {
    logger.error(
      error,
      "⚠️ Seed check failed (continuing anyway - server will start)",
    );
  }

  try {
    logger.info("🌱 Checking/seeding allergies...");
    await seedAllergies();
    logger.info("✅ Allergies ready");
  } catch (error) {
    logger.error(
      error,
      "⚠️ Allergy seed check failed (continuing anyway - server will start)",
    );
  }

  logger.info("🚀 Starting server...");
  Bun.serve(server);
}

start();
