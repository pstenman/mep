import type { MenuType } from "@mep/types";
import type { InferSelectModel } from "drizzle-orm";
import {
  transformMenuItems,
  type FormattedMenuItem,
  type RawMenuItemWithRelations,
} from "../menu-items/transform";
import type { menus } from "@mep/db";

export interface FormattedMenu {
  id: string;
  name: string;
  menuType: MenuType;
  isActive: boolean;
  menuItems: FormattedMenuItem[];
}

export type RawMenuWithRelations = InferSelectModel<typeof menus> & {
  menuItems?: RawMenuItemWithRelations[];
};

export const transformMenu = (menu: RawMenuWithRelations): FormattedMenu => {
  return {
    id: menu.id,
    name: menu.name,
    menuType: menu.menuType as MenuType,
    isActive: menu.isActive,
    menuItems: menu.menuItems ? transformMenuItems(menu.menuItems) : [],
  };
};

export const transformMenus = (
  menus: RawMenuWithRelations[],
): FormattedMenu[] => {
  return menus.map(transformMenu);
};
