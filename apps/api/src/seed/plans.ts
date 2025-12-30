import "dotenv/config";
import { logger, PlanService } from "../index";
import { PlanInterval } from "@mep/types";

async function seedPlans() {
  try {
    const plan = await PlanService.create({
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

