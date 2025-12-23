import type { LucideIcon } from "lucide-react";
import type { DashboardPath } from "./dashboard-prefix";

export interface NavItem {
  id: string;
  labelKey: string;
  href: DashboardPath;
}

export interface NavGroup {
  id: "preparations" | "menus" | "recepies" | "allergies" | "orders";
  titleKey: string;
  href?: DashboardPath;
  icon: LucideIcon;
  collapsible: boolean;
  items?: readonly NavItem[];
}

export type ProcessedNavItem = {
  id: string;
  label: string;
  href: DashboardPath;
  isActive: boolean;
};

export type ProcessedNavGroup = {
  id: string;
  title: string;
  href?: DashboardPath;
  icon?: NavGroup["icon"];
  collapsible: boolean;
  isActive: boolean;
  items?: ProcessedNavItem[];
  activeItem?: ProcessedNavItem;
};

const VALID_GROUPS = [
  "main",
  "breakfast",
  "lunch",
  "al-a-carte",
  "set",
  "group",
] as const;

export type PrepGroup = typeof VALID_GROUPS[number];

export type GroupKey = typeof VALID_GROUPS[number];
export type GroupedSection = "preparations" | "menus" | "orders" | "allergies";
