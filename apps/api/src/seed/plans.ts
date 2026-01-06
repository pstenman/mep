import { logger, PlanService } from "../index";
import { PlanInterval } from "@mep/types";
import { planQueries } from "@mep/db";

export async function seedPlans() {
  try {
    const existingPlan = await planQueries.getDefault();

    if (existingPlan) {
      logger.info(
        { planId: existingPlan.id },
        "✅ Plan already exists, skipping seed",
      );
      return existingPlan.id;
    }

    const plan = await PlanService.create({
      price: 3000,
      interval: PlanInterval.MONTH,
      stripePriceId: process.env.STRIPE_BASIC_PRICE_ID || "local-basic-plan",
      translations: [
        { locale: "en", name: "Basic", description: "Basic subscription plan" },
        { locale: "sv", name: "Bas", description: "Bas-abonnemang" },
      ],
    });

    logger.info({ planId: plan.id }, "✅ Seeded plan successfully");
    return plan.id;
  } catch (error) {
    logger.error(error, "❌ Failed to seed plan");
    throw error;
  }
}

if (import.meta.main) {
  seedPlans()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
