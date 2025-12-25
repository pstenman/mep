"use client";

import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { useMemo } from "react";
import type { ProcessedNavGroup } from "./types";
import type { DashboardPath } from "../paths";
import { Navigation } from "./config";
import { applyNavSettings } from "./settings";

/**
 * Hook to get processed navigation groups with translated labels and active states
 * @returns Array of processed navigation groups
 */
export function useDashboardNavigation(): ProcessedNavGroup[] {
  const pathname = usePathname();
  const t = useTranslations("pages");

  const visibleNavigation = applyNavSettings(Navigation, []);

  return visibleNavigation.map((group) => {
    const items = group.items?.map((item) => ({
      id: item.id,
      label: t(item.labelKey),
      href: item.href as DashboardPath,
      isActive: pathname === item.href,
    }));

    const activeItem = items?.find((i) => i.isActive);

    const isGroupActive = pathname === group.href || Boolean(activeItem);

    return {
      id: group.id,
      title: t(group.titleKey),
      href: group.href as DashboardPath | undefined,
      icon: group.icon,
      collapsible: group.collapsible,
      isActive: isGroupActive,
      items,
      activeItem,
    };
  });
}

/**
 * Hook to get the currently active navigation group
 * @returns The active navigation group or null
 */
export function useActiveNavGroup(): ProcessedNavGroup | null {
  const navigation = useDashboardNavigation();

  return useMemo(
    () => navigation.find((g) => g.isActive) ?? null,
    [navigation],
  );
}
