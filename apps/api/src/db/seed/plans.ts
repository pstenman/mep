import { createDb } from "@mep/db";
import postgres from "postgres";
import { PlanService } from "@/services/plans/service";
import { PlanInterval } from "@mep/types";
import { logger } from "@/utils/logger";

const connectionString = process.env.DATABASE_URL!;
const client = postgres(connectionString);
const db = createDb(client);

async function seedPlans() {
  try {
    const plan = await PlanService.create(db, {
      price: 3000,
      interval: PlanInterval.MONTH,
      stripePriceId: "local-basic-plan",
      translations: [
        { locale: "en", name: "Basic", description: "Basic subscription plan" },
        { locale: "sv", name: "Bas", description: "Bas-abonnemang" },
      ],
    });

    logger.info({ plan }, "✅ Seeded plan successfully");
  } catch (error) {
    logger.error(error, "❌ Failed to seed plan");
  } finally {
    process.exit();
  }
}

seedPlans();
