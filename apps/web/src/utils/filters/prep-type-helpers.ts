/**
 * PrepType Helper Utilities
 *
 * Utilities for working with PrepType enums and filtering preparation-related data.
 * These are specific to preparations and use PrepType enums.
 */

import { PrepType } from "@mep/types";
import type {
  GroupedSection,
  GroupKey,
} from "@/lib/navigation/dashboard/types";

/**
 * Maps navigation group type to PrepType enum based on section
 * Used for preparations that need PrepType enum values
 *
 * @param section - The section (preparations, menus, orders, allergies)
 * @param group - The navigation group type
 * @returns The corresponding PrepType or null if no mapping exists
 */
export function mapGroupToPrepType(
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
 * Filters groups by prepType (client-side filtering for preparations)
 * Used when server-side filtering isn't available or for client-side data manipulation
 *
 * @param _section - The section (preparations, menus, orders, allergies) - kept for API consistency
 * @param groups - Array of groups to filter
 * @param prepType - The PrepType to filter by, or null to return all groups
 * @returns Filtered array of groups
 */
export function filterGroupsByPrepType<
  T extends { prepTypes?: any; menuType?: string },
>(
  _section: string,
  groups: T[] | undefined | null,
  prepType: string | null,
): T[] {
  if (!groups) return [];
  if (!Array.isArray(groups)) {
    return [];
  }
  if (!prepType) return groups;

  return groups.filter((group) => {
    if (group.prepTypes) {
      const groupPrepTypes = parsePrepTypes(group.prepTypes);
      return groupPrepTypes.some(
        (t) => String(t).toLowerCase() === prepType.toLowerCase(),
      );
    }

    if (group.menuType) {
      return String(group.menuType).toLowerCase() === prepType.toLowerCase();
    }

    return false;
  });
}
