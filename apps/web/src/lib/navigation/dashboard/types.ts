/**
 * Navigation type definitions
 * Centralized types for dashboard navigation structure
 */

import type { LucideIcon } from "lucide-react";
import type { DashboardPath } from "../paths";

/**
 * Valid group keys that can appear in URLs
 */
export const GROUP_KEYS = [
  "main",
  "breakfast",
  "lunch",
  "al-a-carte",
  "set",
  "group",
] as const;

export type GroupKey = (typeof GROUP_KEYS)[number];
export type PrepGroup = (typeof GROUP_KEYS)[number];
export type GroupedSection = "preparations" | "menus" | "allergies";

/**
 * Navigation item (sub-item within a navigation group)
 */
export interface NavItem {
  id: string;
  labelKey: string;
  href: DashboardPath;
}

/**
 * Navigation group (top-level navigation section)
 */
export interface NavGroup {
  id: "preparations" | "menus" | "recipes" | "allergies" | "orders";
  titleKey: string;
  href?: DashboardPath;
  icon: LucideIcon;
  collapsible: boolean;
  items?: readonly NavItem[];
}

/**
 * Processed navigation item with translated label and active state
 */
export type ProcessedNavItem = {
  id: string;
  label: string;
  href: DashboardPath;
  isActive: boolean;
};

/**
 * Processed navigation group with translated labels and active states
 */
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
