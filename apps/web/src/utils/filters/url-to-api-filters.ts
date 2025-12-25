/**
 * Maps URL group parameter directly to filter value for menus API
 * Handles the special case: "al-a-carte" -> "alacarte" (database uses "alacarte" without hyphens)
 *
 * @param group - The URL group parameter (e.g., "breakfast", "lunch", "group", "al-a-carte")
 * @returns The menuType filter value for API, or undefined if no filter should be applied
 *
 * @example
 * urlGroupToMenuTypeFilter("breakfast") // returns "breakfast"
 * urlGroupToMenuTypeFilter("al-a-carte") // returns "alacarte"
 * urlGroupToMenuTypeFilter("all") // returns undefined
 */
export function urlGroupToMenuTypeFilter(
  group: string | "all",
): string | undefined {
  if (group === "all" || group === "main") return undefined;
  if (group === "al-a-carte") return "alacarte";
  return group; // breakfast, lunch, set, group all map directly
}

/**
 * Maps URL group parameter directly to filter value for preparations API
 *
 * @param group - The URL group parameter
 * @returns The prepType filter value for API, or undefined if no filter should be applied
 */
export function urlGroupToPrepTypeFilter(
  group: string | "all",
): string | undefined {
  if (group === "all") return undefined;
  if (group === "al-a-carte") return "al-a-carte";
  return group; // main, breakfast, lunch, set, group all map directly
}
