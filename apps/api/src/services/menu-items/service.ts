import { menuItemQueries, menuItemAllergyQueries, type MenuItemFilters, db } from "@mep/db";
import type {
  CreateMenuItemSchema,
  UpdateMenuItemSchema,
  menuItemFiltersSchema,
} from "./schema";
import type { z } from "zod";
import type { MenuCategory } from "@mep/types";

export class MenuItemService {
  static async getAll(
    companyId: string,
    params?: {
      filter?: z.infer<typeof menuItemFiltersSchema>;
    },
  ) {
    const { filter } = params || {};
    const filters: MenuItemFilters = {
      companyId,
      search: filter?.search,
      menuId: filter?.menuId,
      category: filter?.category as MenuCategory | undefined,
    };
    const rows = await menuItemQueries.getAll(filters);
    return { items: rows };
  }

  static async getById(id: string) {
    return await menuItemQueries.getById(id);
  }

  static async create(input: CreateMenuItemSchema, companyId: string, userId: string) {
    return await db.transaction(async (tx) => {
      const menuItem = await menuItemQueries.create({
        companyId,
        name: input.name,
        menuId: input.menuId,
        category: input.category as MenuCategory,
        description: input.description,
        createdBy: userId,
        updatedBy: userId,
      }, tx);

      if (input.allergyIds && input.allergyIds.length > 0) {
        const allergyInserts = input.allergyIds.map((allergyId) => ({
          companyId,
          menuItemId: menuItem.id,
          allergyId,
          createdBy: userId,
          updatedBy: userId,
        }));
        await menuItemAllergyQueries.createMany(allergyInserts, tx);
      }

      return menuItem;
    });
  }

  static async update(input: UpdateMenuItemSchema, userId: string) {
    const existing = await menuItemQueries.getById(input.id);
    if (!existing) {
      throw new Error("Menu item not found");
    }

    const updateData: Partial<{
      name: string;
      menuId: string | null;
      category: MenuCategory | null;
      updatedBy: string;
    }> = {
      updatedBy: userId,
    };

    if (input.name !== undefined) {
      updateData.name = input.name;
    }

    if (input.menuId !== undefined) {
      updateData.menuId = input.menuId;
    }

    if (input.category !== undefined) {
      updateData.category = input.category as MenuCategory;
    }

    const menuItem = await menuItemQueries.update(input.id, updateData);
    return menuItem;
  }

  static async delete(id: string, companyId: string) {
    const existing = await menuItemQueries.getById(id);
    if (!existing) {
      throw new Error("Menu item not found");
    }
    if (existing.companyId !== companyId) {
      throw new Error("Menu item does not belong to this company");
    }

    await menuItemQueries.delete(id);
    return { success: true };
  }
}

