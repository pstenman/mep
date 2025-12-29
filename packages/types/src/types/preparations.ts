import type { Recipe } from "./recipes";

export enum PrepStatus {
  NONE = "none",
  MARK = "mark",
  PREP = "prep",
  PREP2 = "prep2",
  PRIORITY = "priority",
}

export enum PrepType {
  MAIN = "main",
  BREAKFAST = "breakfast",
  LUNCH = "lunch",
  ALACARTE = "al-a-carte",
  SET = "set",
  GROUP = "group",
}

export interface PrepListItem {
  id: string;
  name: string;
  status?: PrepStatus;
  recipeId?: string | null;
  recipe?: Recipe | null;
}

export interface PrepListGroup {
  id: string;
  name: string;
  items: PrepListItem[];
}
