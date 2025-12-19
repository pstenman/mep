import type { NavGroup } from "./navigation";

export function applyNavSettings(
  nav: NavGroup[],
  hiddenItemIds: string[],
): NavGroup[] {
  return nav.map((group) => ({
    ...group,
    items: group.items?.filter((item) => !hiddenItemIds.includes(item.id)),
  }));
}
