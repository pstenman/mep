/**
 * Dashboard path utilities
 * Handles path prefixing and type safety for dashboard routes
 */

export const DASHBOARD_PREFIX = "/dashboard" as const;
export type DashboardPath = `${typeof DASHBOARD_PREFIX}${string}`;

/**
 * Creates a dashboard path with the /dashboard prefix
 * @param path - The path segment (e.g., "menus/breakfast" or "/menus/breakfast")
 * @returns A typed DashboardPath
 */
export function dashboardPrefix(path: string): DashboardPath {
  if (path.startsWith(DASHBOARD_PREFIX)) return path as DashboardPath;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${DASHBOARD_PREFIX}${normalized}` as DashboardPath;
}

