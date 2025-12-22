"use client";

import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { applyNavSettings } from "../lib/navigation/dashboard/navigation-settings";
import { Navigation, type NavGroup } from "../lib/navigation/dashboard/navigation";
import { mockAdminNavSettings } from "../lib/navigation/dashboard/mock-settings";

export type ProcessedNavItem = {
  id: string;
  label: string;
  href: string;
  isActive: boolean;
};

export type ProcessedNavGroup = {
  id: string;
  title: string;
  href: string;
  icon?: NavGroup["icon"];
  collapsible: boolean;
  isActive: boolean;
  items?: ProcessedNavItem[];
};


export function useDashboardNavigation(): ProcessedNavGroup[] {
  const pathname = usePathname();
  const t = useTranslations("pages");

  const visibleNavigation = applyNavSettings(
    Navigation,
    mockAdminNavSettings.hiddenItemIds,
  );

  return visibleNavigation.map((group) => {
    const isGroupActive =
      pathname === group.href ||
      pathname.startsWith(group.href.replace(/\/[^/]+$/, ""));

    return {
      id: group.id,
      title: t(group.titleKey),
      href: group.href,
      icon: group.icon,
      collapsible: group.collapsible,
      isActive: isGroupActive,
      items: group.items?.map((item) => ({
        id: item.id,
        label: t(item.labelKey),
        href: item.href,
        isActive: pathname === item.href,
      })),
    };
  });
}

export function useActiveNavGroup(): ProcessedNavGroup | null {
  const navigation = useDashboardNavigation();
  return navigation.find((group) => group.isActive) || null;
}

