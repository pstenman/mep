import { allergyQueries, db, type Database } from "@mep/db";
import type { CreateAllergySchema, UpdateAllergySchema } from "./schema";
import type { Allergen } from "@mep/types";

export class AllergyService {
    static async getAll(companyId: string) {
    if (!companyId) throw new Error("Company ID is required");

    const allergies = await allergyQueries.getAll({ companyId });
    const rows = allergies.map(a => ({ id: a.id, name: a.name }));
    return { items: rows };
  }

  static async getById(id: string) {
    return await allergyQueries.getById(id);
  }

  static async create(input: CreateAllergySchema, companyId: string, userId: string) {
    const allergy = await allergyQueries.create({
      name: input.name,
      companyId,
      createdBy: userId,
      updatedBy: userId,
    });
    return allergy;
  }

  static async update(input: UpdateAllergySchema, userId: string) {
    const existing = await allergyQueries.getById(input.id);
    if (!existing) {
      throw new Error("Allergy not found");
    }

    const updateData: Partial<{ name: Allergen, updatedBy: string }> = {
      updatedBy: userId,
    };

    if (input.name !== undefined) {
      updateData.name = input.name;
    }

    const allergy = await allergyQueries.update(input.id, updateData, db as Database);
    return allergy;
  }

  static async delete(id: string) {
    const existing = await allergyQueries.getById(id);
    if (!existing) {
      throw new Error("Allergy not found");
    }

    await allergyQueries.delete(id);
    return { success: true };
  }
}

