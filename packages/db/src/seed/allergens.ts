import "dotenv/config";
import { db } from "../index";
import { allergyQueries } from "../queries/allergies";
import { allergies } from "../schema/allergies";
import { Allergen } from "@mep/types";
import { eq } from "drizzle-orm";

async function seedAllergies() {
  for (const name of Object.values(Allergen)) {
    const existing = await db
      .select()
      .from(allergies)
      .where(eq(allergies.name, name))
      .limit(1);

    if (existing.length === 0) {
      await allergyQueries.create({ name });
    }
  }
}

seedAllergies()
  .then(() => process.exit())
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });