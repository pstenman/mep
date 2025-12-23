export enum CreateRouteKeyEnum {
  USER = "user",
  PREPARATION = "preparation",
}

export type CreateRoutes = {
  match: (pathname: string) => boolean;
  label: string;
  key: CreateRouteKeyEnum;
  title?: string;
}

export const createRoutes: CreateRoutes[] = [
  {
    match: (pathname) => pathname.startsWith("/dashboard/settings"),
    label: "Create User",
    key: CreateRouteKeyEnum.USER,
    title: "Create User",
  },
  {
    match: (pathname) => pathname.startsWith("/dashboard/preparations"),
    label: "Create Preparation",
    key: CreateRouteKeyEnum.PREPARATION,
    title: "Create Preparation",
  },
];
