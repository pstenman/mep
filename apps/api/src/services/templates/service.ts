import { templateQueries, type TemplateFilters } from "@mep/db";
import type {
  CreateTemplateSchema,
  UpdateTemplateSchema,
  templateFiltersSchema,
} from "./schema";
import type { z } from "zod";
import {
  transformPrepListTemplate,
  transformPrepListTemplates,
  type RawPrepListTemplateWithRelations,
} from "./transform";
import type { PrepType } from "@mep/types";

export class TemplateService {
  static async getAll(
    companyId: string,
    params?: {
      filter?: z.infer<typeof templateFiltersSchema>;
    },
  ) {
    const { filter } = params || {};
    const filters: TemplateFilters = {
      companyId,
      search: filter?.search,
      prepType: filter?.prepType,
    };
    const rows = await templateQueries.getAll(filters);
    return {
      items: transformPrepListTemplates(
        rows as RawPrepListTemplateWithRelations[],
      ),
    };
  }

  static async getById(id: string, companyId: string) {
    const template = await templateQueries.getById(id, companyId);
    if (!template) {
      throw new Error("Template not found");
    }
    return transformPrepListTemplate(
      template as RawPrepListTemplateWithRelations,
    );
  }

  static async getActive(companyId: string, prepType: string) {
    const template = await templateQueries.getActive(
      companyId,
      prepType as any,
    );
    if (!template) {
      return null;
    }
    return transformPrepListTemplate(
      template as RawPrepListTemplateWithRelations,
    );
  }

  static async createTemplate(
    data: CreateTemplateSchema,
    companyId: string,
    userId: string,
  ) {
    const template = await templateQueries.create(
      {
        companyId,
        name: data.name,
        menuId: data.menuId ?? null,
        prepTypes: data.prepTypes,
        isActive: false,
        createdBy: userId,
        updatedBy: userId,
      },
      data.groups?.map((group) => ({
        name: group.name,
        note: group.note ?? null,
        items: group.items.map((item) => ({
          name: item.name,
          recipeId: item.recipeId ?? null,
        })),
      })) ?? [],
    );

    const fullTemplate = await templateQueries.getById(template.id, companyId);
    if (!fullTemplate) {
      throw new Error("Failed to fetch created template");
    }

    return transformPrepListTemplate(
      fullTemplate as RawPrepListTemplateWithRelations,
    );
  }

  static async update(
    input: UpdateTemplateSchema,
    companyId: string,
    userId: string,
  ) {
    const existing = await templateQueries.getById(input.id, companyId);
    if (!existing) {
      throw new Error("Template not found");
    }

    const updateData: Partial<{
      name: string;
      menuId: string | null;
      prepTypes: PrepType;
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

    if (input.prepTypes !== undefined) {
      updateData.prepTypes = input.prepTypes as PrepType;
    }

    await templateQueries.update(input.id, updateData);
    const fullTemplate = await templateQueries.getById(input.id, companyId);
    if (!fullTemplate) {
      throw new Error("Failed to fetch updated template");
    }
    return transformPrepListTemplate(
      fullTemplate as RawPrepListTemplateWithRelations,
    );
  }

  static async delete(id: string, companyId: string) {
    const existing = await templateQueries.getById(id, companyId);
    if (!existing) {
      throw new Error("Template not found");
    }

    await templateQueries.delete(id, companyId);
    return { success: true };
  }

  static async setActive(
    templateId: string,
    companyId: string,
    prepType: string,
  ) {
    const existing = await templateQueries.getById(templateId, companyId);
    if (!existing) {
      throw new Error("Template not found");
    }

    await templateQueries.setActive(templateId, companyId, prepType as any);

    const fullTemplate = await templateQueries.getById(templateId, companyId);
    if (!fullTemplate) {
      throw new Error("Failed to fetch updated template");
    }
    return transformPrepListTemplate(
      fullTemplate as RawPrepListTemplateWithRelations,
    );
  }
}
