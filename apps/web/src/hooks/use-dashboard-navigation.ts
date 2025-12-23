"use client";

import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";

import { useMemo } from "react";
import type { ProcessedNavGroup } from "@/utils/nav-path/types";
import type { DashboardPath } from "@/utils/nav-path/dashboard-prefix";
import type { NavGroup } from "@/lib/navigation/dashboard/navigation";
import { mockAdminNavSettings } from "@/lib/navigation/dashboard/mock-settings";
import { Navigation } from "@/utils/nav-path/groups";
import { applyNavSettings } from "@/lib/navigation/dashboard/navigation-settings";
export function useDashboardNavigation(): ProcessedNavGroup[] {
  const pathname = usePathname();
  const t = useTranslations("pages");

  const visibleNavigation = applyNavSettings(
    Navigation as unknown as NavGroup[],
    mockAdminNavSettings.hiddenItemIds,
  ) as typeof Navigation;

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

export function useActiveNavGroup(): ProcessedNavGroup | null {
  const navigation = useDashboardNavigation();

  return useMemo(
    () => navigation.find((g) => g.isActive) ?? null,
    [navigation],
  );
}

