import { menuQueries, type MenuFilters } from "@mep/db";
import type { CreateMenuSchema, UpdateMenuSchema, menuFiltersSchema } from "./schema";
import type { z } from "zod";

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
    const menu = await menuQueries.create({
      companyId,
      name: input.name,
      menuType: input.menuType,
      createdBy: userId,
      updatedBy: userId,
    });
    return menu;
  }

  static async update(input: UpdateMenuSchema, userId: string) {
    const existing = await menuQueries.getById(input.id);
    if (!existing) {
      throw new Error("Menu not found");
    }

    const updateData: Partial<{
      name: string;
      menuType: string | null;
      updatedBy: string;
    }> = {
      updatedBy: userId,
    };

    if (input.name !== undefined) {
      updateData.name = input.name;
    }

    if (input.menuType !== undefined) {
      updateData.menuType = input.menuType || null;
    }

    const menu = await menuQueries.update(input.id, updateData);
    return menu;
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

