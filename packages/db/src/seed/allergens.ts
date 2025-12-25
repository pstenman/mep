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

    const COMPANY_ID = process.env.SYSTEM_COMPANY_ID;
const USER_ID = process.env.SYSTEM_USER_ID;

if (!COMPANY_ID || !USER_ID) {
  throw new Error("SYSTEM_COMPANY_ID or SYSTEM_USER_ID is missing");
}

  if (existing.length === 0) {
    await allergyQueries.create({
      name,
      companyId: COMPANY_ID,
      createdBy: USER_ID,
      updatedBy: USER_ID,
    });
    }
  }
}

seedAllergies()
  .then(() => process.exit())
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });