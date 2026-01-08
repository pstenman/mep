import type { Recipe } from "./recipes";

export enum PrepStatus {
  NONE = "N",
  MARK = "M",
  PREP = "P",
  PREP2 = "P2",
  PRIORITY = "P!",
  DONE = "D",
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

export interface PrepGroupNote {
  id: string;
  message: string;
  createdBy: string;
  createdAt: string;
}

export interface PrepListGroup {
  id: string;
  name: string;
  notes?: PrepGroupNote[];
  items: PrepListItem[];
}
