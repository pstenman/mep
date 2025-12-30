export enum CreateRouteKeyEnum {
  USER = "user",
  PREPARATION = "preparation",
  MENU = "menu",
  RECIPE = "recipe",
  ALLERGY = "allergy",
  ORDER = "order",
}

export type CreateRoutes = {
  match: (pathname: string) => boolean;
  label: string;
  key: CreateRouteKeyEnum;
  title?: string;
};

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
  {
    match: (pathname) => pathname.startsWith("/dashboard/menus"),
    label: "Create Menu",
    key: CreateRouteKeyEnum.MENU,
    title: "Create Menu",
  },
  {
    match: (pathname) => pathname.startsWith("/dashboard/recipes"),
    label: "Create Recipe",
    key: CreateRouteKeyEnum.RECIPE,
    title: "Create Recipe",
  },
  {
    match: (pathname) => pathname.startsWith("/dashboard/allergies"),
    label: "Create Allergy",
    key: CreateRouteKeyEnum.ALLERGY,
    title: "Create Allergy",
  },
  {
    match: (pathname) => pathname.startsWith("/dashboard/orders"),
    label: "Create Order",
    key: CreateRouteKeyEnum.ORDER,
    title: "Create Order",
  },
];
