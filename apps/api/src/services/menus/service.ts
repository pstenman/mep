import { menuQueries, menuItemQueries, menuItemAllergyQueries, type MenuFilters, db } from "@mep/db";
import type { CreateMenuSchema, UpdateMenuSchema, menuFiltersSchema } from "./schema";
import type { z } from "zod";
import type { MenuType, MenuCategory } from "@mep/types";

export class MenuService {
  static async getAll(
    companyId: string,
    params?: {
      filter?: z.infer<typeof menuFiltersSchema>;
    },
  ) {
    const { filter } = params || {};
    const filters: MenuFilters = {
      companyId,
      search: filter?.search,
    };
    const rows = await menuQueries.getAll(filters);
    return { items: rows };
  }

  static async getById(id: string) {
    return await menuQueries.getById(id);
  }

  static async create(input: CreateMenuSchema, companyId: string, userId: string) {
    return await db.transaction(async (tx) => {
      const menu = await menuQueries.create(
        {
          companyId,
          name: input.name,
          menuType: input.menuType as MenuType,
          isActive: input.isActive ?? false,
          createdBy: userId,
          updatedBy: userId,
        },
        tx,
      );

      if (input.menuItems && input.menuItems.length > 0) {
        for (const menuItem of input.menuItems) {
          const createdMenuItem = await menuItemQueries.create(
            {
              companyId,
              menuId: menu.id,
              name: menuItem.name,
              category: menuItem.category as MenuCategory,
              description: menuItem.description || null,
              createdBy: userId,
              updatedBy: userId,
            },
            tx,
          );

          if (menuItem.allergyIds && menuItem.allergyIds.length > 0) {
            const allergyInserts = menuItem.allergyIds.map((allergyId) => ({
              companyId,
              menuItemId: createdMenuItem.id,
              allergyId,
              createdBy: userId,
              updatedBy: userId,
            }));
            await menuItemAllergyQueries.createMany(allergyInserts, tx);
          }
        }
      }

      return menu;
    });
  }

  static async update(input: UpdateMenuSchema, userId: string) {
    const existing = await menuQueries.getById(input.id);
    if (!existing) {
      throw new Error("Menu not found");
    }

    return await db.transaction(async (tx) => {
      const updateData: Partial<{
        name: string;
        menuType: MenuType | null;
        isActive: boolean;
        updatedBy: string;
      }> = {
        updatedBy: userId,
      };

      if (input.name !== undefined) {
        updateData.name = input.name;
      }

      if (input.menuType !== undefined) {
        updateData.menuType = input.menuType as MenuType;
      }

      if (input.isActive !== undefined) {
        updateData.isActive = input.isActive;
      }

      const menu = await menuQueries.update(input.id, updateData as any, tx);

      if (input.menuItems !== undefined) {
        const existingMenuItems = existing.menuItems || [];

        for (const existingItem of existingMenuItems) {
          await menuItemAllergyQueries.deleteByMenuItemId(existingItem.id, tx);
          await menuItemQueries.delete(existingItem.id, tx);
        }

        for (const menuItem of input.menuItems) {
          const createdMenuItem = await menuItemQueries.create(
            {
              companyId: existing.companyId,
              menuId: menu.id,
              name: menuItem.name,
              category: menuItem.category as MenuCategory,
              description: menuItem.description || null,
              createdBy: userId,
              updatedBy: userId,
            },
            tx,
          );

          if (menuItem.allergyIds && menuItem.allergyIds.length > 0) {
            const allergyInserts = menuItem.allergyIds.map((allergyId) => ({
              companyId: existing.companyId,
              menuItemId: createdMenuItem.id,
              allergyId,
              createdBy: userId,
              updatedBy: userId,
            }));
            await menuItemAllergyQueries.createMany(allergyInserts, tx);
          }
        }
      }

      return menu;
    });
  }

  static async delete(id: string, companyId: string) {
    const existing = await menuQueries.getById(id);
    if (!existing) {
      throw new Error("Menu not found");
    }
    if (existing.companyId !== companyId) {
      throw new Error("Menu does not belong to this company");
    }

    await menuQueries.delete(id);
    return { success: true };
  }
}

