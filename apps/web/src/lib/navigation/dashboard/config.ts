/**
 * Dashboard navigation configuration
 * Defines the navigation structure and helper functions
 */

import {
  ClipboardList,
  Utensils,
  ChefHat,
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
 * Maps group key to PrepType
 */
const groupKeyToPrepType = (group: string): string | null => {
  const mapping: Record<string, string> = {
    main: "main",
    breakfast: "breakfast",
    lunch: "lunch",
    "al-a-carte": "al-a-carte",
    set: "set",
    group: "group",
  };
  return mapping[group] ?? null;
};

/**
 * Generates navigation items for a given section prefix
 * @param prefix - The section prefix (e.g., "preparations", "menus")
 * @param labelSuffix - Suffix to append to label keys (e.g., "Menu", "Allergies")
 * @param enabledPrepTypes - Optional array of enabled prep types to filter by
 * @returns Array of navigation items for that section
 */
export const groupNavItems = (
  prefix: string,
  labelSuffix: string,
  enabledPrepTypes?: string[],
): readonly NavItem[] => {
  const allGroups = [
    "main",
    "breakfast",
    "lunch",
    "al-a-carte",
    "set",
    "group",
  ] as const;

  const filteredGroups = enabledPrepTypes
    ? allGroups.filter((group) => {
        const prepType = groupKeyToPrepType(group);
        return prepType && enabledPrepTypes.includes(prepType);
      })
    : allGroups;

  return filteredGroups.map((group) => ({
    id: `${prefix}-${group}`,
    labelKey: groupKeyToLabelKey(group, labelSuffix),
    href: dashboardPrefix(`${prefix}/${group}`),
  }));
};

/**
 * Gets the first enabled prep type group key, or falls back to a default
 */
const getFirstEnabledGroup = (enabledPrepTypes?: string[]): string => {
  if (!enabledPrepTypes || enabledPrepTypes.length === 0) {
    return "main";
  }

  // Priority order: main, breakfast, lunch, al-a-carte, set, group
  const priority = ["main", "breakfast", "lunch", "al-a-carte", "set", "group"];
  return (
    priority.find((group) => {
      const prepType = groupKeyToPrepType(group);
      return prepType && enabledPrepTypes.includes(prepType);
    }) ||
    enabledPrepTypes[0] ||
    "main"
  );
};

/**
 * Creates navigation structure with optional prep type filtering
 * @param enabledPrepTypes - Optional array of enabled prep types
 * @returns Navigation groups array
 */
export const createNavigation = (enabledPrepTypes?: string[]): NavGroup[] => {
  const firstGroup = getFirstEnabledGroup(enabledPrepTypes);
  const firstBreakfastGroup = enabledPrepTypes?.includes("breakfast")
    ? "breakfast"
    : firstGroup;

  return [
    {
      id: "preparations",
      titleKey: "preparations",
      href: dashboardPrefix(`preparations/${firstGroup}`),
      icon: ClipboardList,
      collapsible: true,
      items: groupNavItems("preparations", "", enabledPrepTypes),
    },
    {
      id: "menus",
      titleKey: "menus",
      href: dashboardPrefix(`menus/${firstBreakfastGroup}`),
      icon: Utensils,
      collapsible: true,
      items: groupNavItems("menus", "Menu", enabledPrepTypes),
    },
    {
      id: "recipes",
      titleKey: "recipes",
      href: dashboardPrefix("recipes"),
      icon: ChefHat,
      collapsible: false,
    },
    {
      id: "allergies",
      titleKey: "allergyList",
      href: dashboardPrefix(`allergies/${firstBreakfastGroup}`),
      icon: WheatOff,
      collapsible: true,
      items: groupNavItems("allergies", "Allergies", enabledPrepTypes),
    },
    {
      id: "orders",
      titleKey: "orders",
      href: dashboardPrefix("orders"),
      icon: Truck,
      collapsible: false,
    },
  ];
};
