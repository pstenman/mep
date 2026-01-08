import { db } from "@mep/db";
import { allergyQueries } from "@mep/db/queries/allergies.js";
import { allergies } from "@mep/db/schema/allergies.js";
import { Allergen } from "@mep/types";
import { eq } from "drizzle-orm";
import { logger } from "../utils/logger";

export async function seedAllergies() {
  try {
    const COMPANY_ID = process.env.SYSTEM_COMPANY_ID;
    const USER_ID = process.env.SYSTEM_USER_ID;

    if (!COMPANY_ID || !USER_ID) {
      throw new Error("SYSTEM_COMPANY_ID or SYSTEM_USER_ID is missing");
    }

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
          companyId: COMPANY_ID,
          createdBy: USER_ID,
          updatedBy: USER_ID,
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
