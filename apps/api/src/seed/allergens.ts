import { db, allergies, allergyQueries } from "@mep/db";
import { Allergen } from "@mep/types";
import { eq } from "drizzle-orm";
import { logger } from "../utils/logger";

export async function seedAllergies() {
  try {
    let createdCount = 0;
    let skippedCount = 0;

    for (const name of Object.values(Allergen)) {
      const existing = await db
        .select()
        .from(allergies)
        .where(eq(allergies.name, name))
        .limit(1);

      if (existing.length === 0) {
        await allergyQueries.create({
          name,
          createdBy: null,
          updatedBy: null,
        });
        createdCount++;
      } else {
        skippedCount++;
      }
    }

    logger.info(
      { created: createdCount, skipped: skippedCount },
      "✅ Allergies seeded successfully",
    );
  } catch (error) {
    logger.error(error, "❌ Failed to seed allergies");
    throw error;
  }
}

if (import.meta.main) {
  seedAllergies()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
