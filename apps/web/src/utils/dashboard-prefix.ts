export const DASHBOARD_PREFIX = "/dashboard";

export function dashboardPrefix(path: string) {
  if (path.startsWith(DASHBOARD_PREFIX)) return path;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${DASHBOARD_PREFIX}${normalized}`;
}
