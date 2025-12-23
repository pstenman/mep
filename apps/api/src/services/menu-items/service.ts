import { menuItemQueries, type MenuItemFilters } from "@mep/db";
import type {
  CreateMenuItemSchema,
  UpdateMenuItemSchema,
  menuItemFiltersSchema,
} from "./schema";
import type { z } from "zod";

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
      category: filter?.category,
    };
    const rows = await menuItemQueries.getAll(filters);
    return { items: rows };
  }

  static async getById(id: string) {
    return await menuItemQueries.getById(id);
  }

  static async create(input: CreateMenuItemSchema, companyId: string, userId: string) {
    const menuItem = await menuItemQueries.create({
      companyId,
      name: input.name,
      menuId: input.menuId,
      category: input.category,
      createdBy: userId,
      updatedBy: userId,
    });
    return menuItem;
  }

  static async update(input: UpdateMenuItemSchema, userId: string) {
    const existing = await menuItemQueries.getById(input.id);
    if (!existing) {
      throw new Error("Menu item not found");
    }

    const updateData: Partial<{
      name: string;
      menuId: string | null;
      category: string | null;
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
      updateData.category = input.category;
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

