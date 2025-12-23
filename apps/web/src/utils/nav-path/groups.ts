import { ListChecks, BookOpenText, BookText, WheatOff, Truck } from "lucide-react";
import { dashboardPrefix } from "./dashboard-prefix";
import type { NavGroup, NavItem } from "./types";

export const GROUP_KEYS = [
  "main",
  "breakfast",
  "lunch",
  "al-a-carte",
  "set",
  "group",
] as const;

export type GroupKey = typeof GROUP_KEYS[number];

const groupKeyToLabelKey = (group: string, suffix: string): string => {
  if (group === "main") return "main";
  if (group === "al-a-carte") {
    return suffix ? `alacarte${suffix}` : "alACarte";
  }
  return `${group}${suffix}`;
};

export const groupNavItems = (prefix: string, labelSuffix: string): readonly NavItem[] =>
  GROUP_KEYS.map((group) => ({
    id: `${prefix}-${group}`,
    labelKey: groupKeyToLabelKey(group, labelSuffix),
    href: dashboardPrefix(`${prefix}/${group}`),
  }));

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
    id: "recepies",
    titleKey: "recepies",
    href: dashboardPrefix("recepies"),
    icon: BookText,
    collapsible: false,
  },
  {
    id: "allergies",
    titleKey: "allergyList",
    href: dashboardPrefix("allergies/all"),
    icon: WheatOff,
    collapsible: true,
    items: [
      {
        id: "allergies-all",
        labelKey: "all",
        href: dashboardPrefix("allergies/all"),
      },
      ...groupNavItems("allergies", "Allergies"),
    ],
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
