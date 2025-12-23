export const DASHBOARD_PREFIX = "/dashboard" as const;
export type DashboardPath = `${typeof DASHBOARD_PREFIX}${string}`;

export function dashboardPrefix(path: string): DashboardPath {
  if (path.startsWith(DASHBOARD_PREFIX)) return path as DashboardPath;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${DASHBOARD_PREFIX}${normalized}` as DashboardPath;
}

