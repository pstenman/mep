/**
 * Dashboard navigation configuration
 * Defines the navigation structure and helper functions
 */

import {
  ListChecks,
  BookOpenText,
  BookText,
  WheatOff,
  Truck,
} from "lucide-react";
import { dashboardPrefix } from "../paths";
import type { NavGroup, NavItem } from "./types";

/**
 * Maps group key to label key with optional suffix
 * Handles special cases like "al-a-carte" -> "alacarte" + suffix
 */
const groupKeyToLabelKey = (group: string, suffix: string): string => {
  if (group === "main") return "main";
  if (group === "al-a-carte") {
    return suffix ? `alacarte${suffix}` : "alACarte";
  }
  return `${group}${suffix}`;
};

/**
 * Generates navigation items for a given section prefix
 * @param prefix - The section prefix (e.g., "preparations", "menus")
 * @param labelSuffix - Suffix to append to label keys (e.g., "Menu", "Allergies")
 * @returns Array of navigation items for that section
 */
export const groupNavItems = (
  prefix: string,
  labelSuffix: string,
): readonly NavItem[] =>
  (["main", "breakfast", "lunch", "al-a-carte", "set", "group"] as const).map(
    (group) => ({
      id: `${prefix}-${group}`,
      labelKey: groupKeyToLabelKey(group, labelSuffix),
      href: dashboardPrefix(`${prefix}/${group}`),
    }),
  );

/**
 * Dashboard navigation structure
 * Defines all navigation groups and their items
 */
export const Navigation: NavGroup[] = [
  {
    id: "preparations",
    titleKey: "preparations",
    href: dashboardPrefix("preparations/main"),
    icon: ListChecks,
    collapsible: true,
    items: groupNavItems("preparations", ""),
  },
  {
    id: "menus",
    titleKey: "menus",
    href: dashboardPrefix("menus/breakfast"),
    icon: BookOpenText,
    collapsible: true,
    items: groupNavItems("menus", "Menu"),
  },
  {
    id: "recipes",
    titleKey: "recipes",
    href: dashboardPrefix("recipes"),
    icon: BookText,
    collapsible: false,
  },
  {
    id: "allergies",
    titleKey: "allergyList",
    href: dashboardPrefix("allergies/breakfast"),
    icon: WheatOff,
    collapsible: true,
    items: groupNavItems("allergies", "Allergies"),
  },
  {
    id: "orders",
    titleKey: "orders",
    href: dashboardPrefix("orders/all"),
    icon: Truck,
    collapsible: true,
    items: [
      {
        id: "orders-all",
        labelKey: "all",
        href: dashboardPrefix("orders/all"),
      },
      ...groupNavItems("orders", "Orders"),
    ],
  },
] as const;
