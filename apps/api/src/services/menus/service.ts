import {
  menuQueries,
  menuItemQueries,
  menuItemAllergyQueries,
  db,
  type MenuFilters,
} from "@mep/db";
import type {
  CreateMenuSchema,
  UpdateMenuSchema,
  menuFiltersSchema,
} from "./schema";
import type { MenuType, MenuCategory } from "@mep/types";
import type { z } from "zod";
import {
  transformMenu,
  transformMenus,
  type FormattedMenu,
  type RawMenuWithRelations,
} from "./transform";
import { MenuItemService } from "../menu-items/service";

export class MenuService {
  static async getAll(
    companyId: string,
    params?: {
      filter?: z.infer<typeof menuFiltersSchema>;
    },
  ) {
    const filters: MenuFilters = {
      companyId,
      search: params?.filter?.search,
      menuType: params?.filter?.menuType as MenuType | undefined,
    };

    const rows = await menuQueries.getAll(filters);
    return { items: transformMenus(rows as RawMenuWithRelations[]) };
  }

  static async getById(id: string) {
    const menu = await menuQueries.getById(id);
    if (!menu) throw new Error("Menu not found");
    return transformMenu(menu);
  }

  static async create(
    input: CreateMenuSchema,
    companyId: string,
    userId: string,
  ): Promise<FormattedMenu> {
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
        for (const item of input.menuItems) {
          const createdItem = await menuItemQueries.create(
            {
              companyId,
              menuId: menu.id,
              name: item.name,
              category: item.category as MenuCategory,
              description: item.description || null,
              createdBy: userId,
              updatedBy: userId,
            },
            tx,
          );

          await MenuItemService.setAllergies(
            createdItem.id,
            item.allergyIds ?? [],
            companyId,
            userId,
            tx,
          );
        }
      }

      return transformMenu(menu);
    });
  }

  static async update(
    input: UpdateMenuSchema,
    userId: string,
  ): Promise<FormattedMenu> {
    const existing = await menuQueries.getById(input.id);
    if (!existing) throw new Error("Menu not found");

    return await db.transaction(async (tx) => {
      const updateData: Partial<{
        name: string;
        menuType: MenuType | null;
        isActive: boolean;
        updatedBy: string;
      }> = { updatedBy: userId };

      if (input.name !== undefined) updateData.name = input.name;
      if (input.menuType !== undefined)
        updateData.menuType = input.menuType as MenuType;
      if (input.isActive !== undefined) updateData.isActive = input.isActive;

      const menu = await menuQueries.update(input.id, updateData as any, tx);

      if (input.menuItems !== undefined) {
        for (const oldItem of existing.menuItems ?? []) {
          await menuItemAllergyQueries.deleteByMenuItemId(oldItem.id, tx);
          await menuItemQueries.delete(oldItem.id, tx);
        }

        for (const item of input.menuItems) {
          const createdItem = await menuItemQueries.create(
            {
              companyId: existing.companyId,
              menuId: menu.id,
              name: item.name,
              category: item.category as MenuCategory,
              description: item.description || null,
              createdBy: userId,
              updatedBy: userId,
            },
            tx,
          );

          await MenuItemService.setAllergies(
            createdItem.id,
            item.allergyIds ?? [],
            existing.companyId,
            userId,
            tx,
          );
        }
      }

      return transformMenu(menu);
    });
  }

  static async delete(id: string, companyId: string) {
    const existing = await menuQueries.getById(id);
    if (!existing) throw new Error("Menu not found");
    if (existing.companyId !== companyId)
      throw new Error("Menu does not belong to this company");

    await menuQueries.delete(id);
    return { success: true };
  }
}
