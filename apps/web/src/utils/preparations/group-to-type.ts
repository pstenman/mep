import { PrepType } from "@mep/types";
import type { GroupedSection, GroupKey } from "../nav-path/types";

type PrepGroupWithTypes = {
  prepTypes?: string | PrepType[] | null;
  id?: string;
  name?: string;
  note?: string | null;
  prepItems?: unknown;
};

/**
 * Maps navigation group type to PrepType enum based on section
 * @param section - The section (preparations, menues, orders, allergies)
 * @param group - The navigation group type
 * @returns The corresponding PrepType or null if no mapping exists
 */
export function mapGroupToType(
  section: GroupedSection,
  group: GroupKey | "all",
): PrepType | null {
  if (group === "all") return null;
  
  if (group === "main" && section !== "preparations") return null;
  
  const mapping: Record<GroupKey, PrepType> = {
    breakfast: PrepType.BREAKFAST,
    lunch: PrepType.LUNCH,
    "al-a-carte": PrepType.ALACARTE,
    set: PrepType.SET,
    group: PrepType.GROUP,
    main: PrepType.MAIN,
  };
  
  return mapping[group as GroupKey] ?? null;
}

/**
 * Parses prepTypes from string (JSON) or returns array if already parsed
 * @param prepTypes - The prepTypes value (string or array)
 * @returns Array of PrepType or empty array
 */
export function parsePrepTypes(
  prepTypes: string | PrepType[] | null | undefined,
): PrepType[] {
  if (!prepTypes) return [];
  if (Array.isArray(prepTypes)) return prepTypes;
  try {
    return JSON.parse(prepTypes) as PrepType[];
  } catch {
    return [];
  }
}

/**
 * Filters groups by prepType
 * @param _section - The section (preparations, menues, orders, allergies) - kept for API consistency
 * @param groups - Array of groups to filter
 * @param prepType - The PrepType to filter by, or null to return all groups
 * @returns Filtered array of groups
 */
export function filterGroupsByType<T extends { prepTypes?: any; menuType?: string }>(
  _section: string,
  groups: T[] | undefined | null,
  prepType: string | null,
): T[] {
  if (!groups) return [];
  if (!prepType) return groups;

  return groups.filter((group) => {
    if (group.prepTypes) {
      const groupPrepTypes = parsePrepTypes(group.prepTypes);
      return groupPrepTypes.some(
        (t) => String(t).toLowerCase() === prepType.toLowerCase()
      );
    }

    if (group.menuType) {
      return String(group.menuType).toLowerCase() === prepType.toLowerCase();
    }

    return false;
  });
}
