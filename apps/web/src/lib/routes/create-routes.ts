export type CreateRouteKey = "user";

export type CreateRoutes = {
  match: (pathname: string) => boolean;
  label: string;
  key: CreateRouteKey;
  title?: string;
}

export const createRoutes: CreateRoutes[] = [
  {
    match: (pathname) => pathname.startsWith("/dashboard/settings"),
    label: "Create User",
    key: "user",
    title: "Create User",
  },
];
