import type { PrepType } from "@mep/types";
import type { InferSelectModel } from "drizzle-orm";
import type {
  prepListTemplates,
  prepGroupTemplates,
  prepItemsTemplates,
} from "@mep/db";

export interface FormattedPrepItemTemplate {
  id: string;
  name: string;
  recipeId: string | null;
}

export interface FormattedPrepGroupTemplate {
  id: string;
  name: string;
  note: string | null;
  menuItemId: string | null;
  prepItemsTemplates: FormattedPrepItemTemplate[];
}

export interface FormattedPrepListTemplate {
  id: string;
  name: string;
  prepTypes: PrepType;
  isActive: boolean;
  menuId: string | null;
  prepGroupTemplates: FormattedPrepGroupTemplate[];
}

export type RawPrepItemTemplateWithRelations = InferSelectModel<
  typeof prepItemsTemplates
>;

export type RawPrepGroupTemplateWithRelations = InferSelectModel<
  typeof prepGroupTemplates
> & {
  prepItemsTemplates?: RawPrepItemTemplateWithRelations[];
};

export type RawPrepListTemplateWithRelations = InferSelectModel<
  typeof prepListTemplates
> & {
  prepGroupTemplates?: RawPrepGroupTemplateWithRelations[];
};

export const transformPrepItemTemplate = (
  prepItemTemplate: RawPrepItemTemplateWithRelations,
): FormattedPrepItemTemplate => {
  return {
    id: prepItemTemplate.id,
    name: prepItemTemplate.name,
    recipeId: prepItemTemplate.recipeId ?? null,
  };
};

export const transformPrepItemTemplates = (
  prepItemTemplates: RawPrepItemTemplateWithRelations[],
): FormattedPrepItemTemplate[] => {
  return prepItemTemplates.map(transformPrepItemTemplate);
};

export const transformPrepGroupTemplate = (
  prepGroupTemplate: RawPrepGroupTemplateWithRelations,
): FormattedPrepGroupTemplate => {
  return {
    id: prepGroupTemplate.id,
    name: prepGroupTemplate.name,
    note: prepGroupTemplate.note ?? null,
    menuItemId: prepGroupTemplate.menuItemId ?? null,
    prepItemsTemplates: prepGroupTemplate.prepItemsTemplates
      ? transformPrepItemTemplates(prepGroupTemplate.prepItemsTemplates)
      : [],
  };
};

export const transformPrepGroupTemplates = (
  prepGroupTemplates: RawPrepGroupTemplateWithRelations[],
): FormattedPrepGroupTemplate[] => {
  return prepGroupTemplates.map(transformPrepGroupTemplate);
};

export const transformPrepListTemplate = (
  prepListTemplate: RawPrepListTemplateWithRelations | null,
): FormattedPrepListTemplate | null => {
  if (!prepListTemplate) return null;

  return {
    id: prepListTemplate.id,
    name: prepListTemplate.name,
    prepTypes: prepListTemplate.prepTypes as PrepType,
    isActive: prepListTemplate.isActive,
    menuId: prepListTemplate.menuId ?? null,
    prepGroupTemplates: prepListTemplate.prepGroupTemplates
      ? transformPrepGroupTemplates(prepListTemplate.prepGroupTemplates)
      : [],
  };
};

export const transformPrepListTemplates = (
  prepListTemplates: RawPrepListTemplateWithRelations[],
): FormattedPrepListTemplate[] => {
  return prepListTemplates
    .map(transformPrepListTemplate)
    .filter(
      (template): template is FormattedPrepListTemplate => template !== null,
    );
};
