import {
  menuItemQueries,
  menuItemAllergyQueries,
  type MenuItemFilters,
  db,
  type Database,
  type MenuItemRow,
} from "@mep/db";
import type {
  CreateMenuItemSchema,
  UpdateMenuItemSchema,
  menuItemFiltersSchema,
} from "./schema";
import type { z } from "zod";
import type { MenuCategory } from "@mep/types";
import {
  transformMenuItems,
  transformMenuItem,
  type RawMenuItemWithRelations,
} from "./transform";

export class MenuItemService {
  static async getAll(
    companyId: string,
    params?: {
      filter?: z.infer<typeof menuItemFiltersSchema>;
    },
  ) {
    const filters: MenuItemFilters = {
      companyId,
      search: params?.filter?.search,
      menuId: params?.filter?.menuId,
      category: params?.filter?.category as MenuCategory | undefined,
    };

    const rows = await menuItemQueries.getAll(filters);
    return { items: transformMenuItems(rows) };
  }

  static async getById(id: string) {
    const row = await menuItemQueries.getById(id);
    if (!row) {
      throw new Error("Menu item not found");
    }
    return transformMenuItem(row);
  }

  static async create(
    input: CreateMenuItemSchema,
    companyId: string,
    userId: string,
  ) {
    return await db.transaction(async (tx) => {
      const menuItem = await menuItemQueries.create(
        {
          companyId,
          name: input.name,
          menuId: input.menuId,
          category: input.category as MenuCategory,
          description: input.description,
          createdBy: userId,
          updatedBy: userId,
        },
        tx,
      );

      await MenuItemService.setAllergies(
        menuItem.id,
        input.allergyIds ?? [],
        companyId,
        userId,
        tx,
      );
      return transformMenuItem(menuItem);
    });
  }

  static async update(input: UpdateMenuItemSchema, userId: string) {
    if (!input.id) {
      throw new Error("Menu item ID is required");
    }
    const existing = await menuItemQueries.getById(input.id);
    if (!existing) throw new Error("Menu item not found");

    const updateData: Partial<
      Omit<MenuItemRow, "id" | "companyId" | "createdAt">
    > = { updatedBy: userId };

    if (input.name !== undefined) updateData.name = input.name;
    if (input.menuId !== undefined) updateData.menuId = input.menuId;
    if (input.category !== undefined)
      updateData.category = input.category as MenuCategory;
    if (input.description !== undefined)
      updateData.description = input.description;

    const menuItem = (await menuItemQueries.update(
      input.id,
      updateData,
    )) as RawMenuItemWithRelations;

    await db.transaction(async (tx) => {
      await MenuItemService.setAllergies(
        menuItem.id,
        input.allergyIds ?? [],
        menuItem.companyId,
        userId,
        tx,
      );
    });

    return transformMenuItem(menuItem);
  }

  static async setAllergies(
    menuItemId: string,
    allergyIds: string[],
    companyId: string,
    userId: string,
    executor?: Database,
  ) {
    const dbOrTx = executor ?? db;
    await dbOrTx.transaction(async (tx) => {
      await menuItemAllergyQueries.deleteByMenuItemId(menuItemId, tx);

      if (allergyIds.length === 0) return;

      const inserts = allergyIds.map((allergyId) => ({
        menuItemId,
        allergyId,
        companyId,
        createdBy: userId,
        updatedBy: userId,
      }));
      await menuItemAllergyQueries.createMany(inserts, tx);
    });
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
