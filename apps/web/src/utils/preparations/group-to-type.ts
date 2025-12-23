import { PrepType } from "@mep/types";
import type { PrepGroup } from "../nav-path/types";

type PrepGroupWithTypes = {
  prepTypes?: string | PrepType[] | null;
  id?: string;
  name?: string;
  note?: string | null;
  prepItems?: unknown;
};

/**
 * Maps navigation PrepGroup type to PrepType enum
 * @param group - The navigation group type
 * @returns The corresponding PrepType or null if no mapping exists
 */
export function mapPrepGroupToType(group: PrepGroup | "all"): PrepType | null {
  if (group === "all") return null;
  
  const mapping: Record<PrepGroup, PrepType> = {
    breakfast: PrepType.BREAKFAST,
    lunch: PrepType.LUNCH,
    "al-a-carte": PrepType.ALACARTE,
    set: PrepType.SET,
    group: PrepType.GROUP,
    main: PrepType.MAIN,
  };
  
  return mapping[group as PrepGroup] ?? null;
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
 * Filters prep groups by prepType
 * @param groups - Array of prep groups to filter
 * @param prepType - The PrepType to filter by, or null to return all groups
 * @returns Filtered array of prep groups
 */
export function filterPrepGroupsByType<T extends PrepGroupWithTypes>(
  groups: T[] | undefined | null,
  prepType: PrepType | null,
): T[] {
  if (!groups) return [];
  if (!prepType) return groups;
  
  return groups.filter((group) => {
    const groupPrepTypes = parsePrepTypes(group.prepTypes);
    return groupPrepTypes.includes(prepType);
  });
}