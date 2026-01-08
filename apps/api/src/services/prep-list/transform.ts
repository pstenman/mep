import { type PrepStatus, PrepType } from "@mep/types";
import type { InferSelectModel } from "drizzle-orm";
import type { prepGroups, prepItems, prepLists } from "@mep/db";

export interface FormattedPrepItem {
  id: string;
  name: string;
  status: PrepStatus;
  recipeId?: string | null;
  recipe?: {
    id: string;
    name: string;
    instructions?: string | null;
    ingredients?: Array<{
      name: string;
      quantity: number;
      unit: string;
    }> | null;
  } | null;
}

export interface FormattedPrepGroup {
  id: string;
  name: string;
  note: string | null;
  notes?: Array<{
    id: string;
    message: string;
    createdBy: string;
    createdAt: string;
  }> | null;
  menuItemId: string | null;
  prepItems: FormattedPrepItem[];
}

export interface FormattedPrepList {
  id: string;
  name: string;
  prepTypes: PrepType;
  isTemplate: boolean;
  scheduleFor: Date | null;
  menuId: string | null;
  prepGroups: FormattedPrepGroup[];
}

export type RawPrepItemWithRelations = InferSelectModel<typeof prepItems> & {
  recipe?: {
    id: string;
    name: string;
    instructions?: string | null;
    ingredients?: Array<{
      name: string;
      quantity: number;
      unit: string;
    }> | null;
  } | null;
};

export type RawPrepGroupWithRelations = InferSelectModel<typeof prepGroups> & {
  prepItems?: RawPrepItemWithRelations[];
};

export type RawPrepListWithRelations = InferSelectModel<typeof prepLists> & {
  prepGroups?: RawPrepGroupWithRelations[];
  prepListTemplate?: {
    id: string;
    name: string;
    prepTypes: string;
    isActive: boolean;
  } | null;
};

export const transformPrepItem = (
  prepItem: RawPrepItemWithRelations,
): FormattedPrepItem => {
  return {
    id: prepItem.id,
    name: prepItem.name,
    status: prepItem.status as PrepStatus,
    recipeId: prepItem.recipeId ?? null,
    recipe: prepItem.recipe
      ? {
          id: prepItem.recipe.id,
          name: prepItem.recipe.name,
          instructions: prepItem.recipe.instructions ?? null,
          ingredients: prepItem.recipe.ingredients ?? null,
        }
      : null,
  };
};

export const transformPrepItems = (
  prepItems: RawPrepItemWithRelations[],
): FormattedPrepItem[] => {
  return prepItems.map(transformPrepItem);
};

export const transformPrepGroup = (
  prepGroup: RawPrepGroupWithRelations,
): FormattedPrepGroup => {
  const notes = prepGroup.notes as
    | Array<{
        id: string;
        message: string;
        createdBy: string;
        createdAt: string;
      }>
    | null
    | undefined;

  return {
    id: prepGroup.id,
    name: prepGroup.name,
    note: prepGroup.note ?? null,
    notes: Array.isArray(notes) ? notes : [],
    menuItemId: prepGroup.menuItemId ?? null,
    prepItems: prepGroup.prepItems
      ? transformPrepItems(prepGroup.prepItems)
      : [],
  };
};

export const transformPrepGroups = (
  prepGroups: RawPrepGroupWithRelations[],
): FormattedPrepGroup[] => {
  return prepGroups.map(transformPrepGroup);
};

export const transformPrepList = (
  prepList: RawPrepListWithRelations | null,
): FormattedPrepList | null => {
  if (!prepList) return null;

  return {
    id: prepList.id,
    name: prepList.name,
    prepTypes: (prepList.prepListTemplate?.prepTypes ??
      PrepType.BREAKFAST) as PrepType,
    isTemplate: false,
    scheduleFor: prepList.scheduleFor ?? null,
    menuId: prepList.menuId ?? null,
    prepGroups: prepList.prepGroups
      ? transformPrepGroups(prepList.prepGroups)
      : [],
  };
};

export const transformPrepLists = (
  prepLists: RawPrepListWithRelations[],
): FormattedPrepList[] => {
  return prepLists
    .map(transformPrepList)
    .filter((list): list is FormattedPrepList => list !== null);
};
