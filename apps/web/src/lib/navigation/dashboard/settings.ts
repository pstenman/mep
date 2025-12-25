import type { NavGroup } from "./types";

/**
 * Applies navigation settings (e.g., hiding items based on permissions)
 * @param nav - Navigation groups to process
 * @param hiddenItemIds - Array of item IDs to hide
 * @returns Filtered navigation groups
 */
export function applyNavSettings(
  nav: NavGroup[],
  hiddenItemIds: string[],
): NavGroup[] {
  return nav.map((group) => ({
    ...group,
    items: group.items?.filter((item) => !hiddenItemIds.includes(item.id)),
  }));
}
