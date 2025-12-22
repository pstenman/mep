import { dashboardPrefix } from "@/utils/dashboard-prefix";
import {
  BookOpenText,
  BookText,
  ListChecks,
  Truck,
  WheatOff,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  id: string;
  labelKey: string;
  href: string;
};

export type NavGroup = {
  id: string;
  titleKey: string;
  href: string;
  icon?: LucideIcon;
  collapsible: boolean;
  items?: NavItem[];
};

export const Navigation: NavGroup[] = [
  {
    id: "preparations",
    titleKey: "preparations",
    href: dashboardPrefix("preparations/main"),
    icon: ListChecks,
    collapsible: true,
    items: [
      {
        id: "prep-main",
        labelKey: "main",
        href: dashboardPrefix("preparations/main"),
      },
      {
        id: "prep-breakfast",
        labelKey: "breakfast",
        href: dashboardPrefix("preparations/breakfast"),
      },
      {
        id: "prep-lunch",
        labelKey: "lunch",
        href: dashboardPrefix("preparations/lunch"),
      },
      {
        id: "prep-alacarte",
        labelKey: "alACarte",
        href: dashboardPrefix("preparations/al-a-carte"),
      },
      {
        id: "prep-set",
        labelKey: "set",
        href: dashboardPrefix("preparations/set"),
      },
      {
        id: "prep-group",
        labelKey: "group",
        href: dashboardPrefix("preparations/group"),
      },
    ],
  },

  {
    id: "menues",
    titleKey: "menues",
    href: dashboardPrefix("menues"),
    icon: BookOpenText,
    collapsible: true,
    items: [
      {
        id: "breakfast-menu",
        labelKey: "breakfastMenu",
        href: dashboardPrefix("menues/breakfast"),
      },
      {
        id: "lunch-menu",
        labelKey: "lunchMenu",
        href: dashboardPrefix("menues/lunch"),
      },
      {
        id: "alacarte-menu",
        labelKey: "alacarteMenu",
        href: dashboardPrefix("menues/al-a-carte"),
      },
      {
        id: "set-menu",
        labelKey: "setMenu",
        href: dashboardPrefix("menues/set"),
      },
      {
        id: "group-menu",
        labelKey: "groupMenu",
        href: dashboardPrefix("menues/group"),
      },
    ],
  },

  {
    id: "recepies",
    titleKey: "recepies",
    icon: BookText,
    href: dashboardPrefix("recepies"),
    collapsible: false,
  },

  {
    id: "allergies",
    titleKey: "allergyList",
    href: dashboardPrefix("allergies/all"),
    icon: WheatOff,
    collapsible: true,
    items: [
      {
        id: "allergies-all",
        labelKey: "all",
        href: dashboardPrefix("allergies/all"),
      },
      {
        id: "allergies-breakfast",
        labelKey: "breakfastAllergies",
        href: dashboardPrefix("allergies/breakfast"),
      },
      {
        id: "allergies-lunch",
        labelKey: "lunchAllergies",
        href: dashboardPrefix("allergies/lunch"),
      },
      {
        id: "allergies-alacarte",
        labelKey: "alacarteAllergies",
        href: dashboardPrefix("allergies/al-a-carte"),
      },
      {
        id: "allergies-set",
        labelKey: "setAllergies",
        href: dashboardPrefix("allergies/set"),
      },
      {
        id: "allergies-group",
        labelKey: "groupAllergies",
        href: dashboardPrefix("allergies/group"),
      },
    ],
  },

  {
    id: "orders",
    titleKey: "orders",
    icon: Truck,
    href: dashboardPrefix("orders/all"),
    collapsible: true,
    items: [
      {
        id: "orders-all",
        labelKey: "all",
        href: dashboardPrefix("orders/all"),
      },
      {
        id: "orders-breakfast",
        labelKey: "breakfastOrders",
        href: dashboardPrefix("orders/breakfast"),
      },
      {
        id: "orders-lunch",
        labelKey: "lunchOrders",
        href: dashboardPrefix("orders/lunch"),
      },
      {
        id: "orders-alacarte",
        labelKey: "alacarteOrders",
        href: dashboardPrefix("orders/al-a-carte"),
      },
      {
        id: "orders-set",
        labelKey: "setOrders",
        href: dashboardPrefix("orders/set"),
      },
      {
        id: "orders-group",
        labelKey: "groupOrders",
        href: dashboardPrefix("orders/group"),
      },
    ],
  },
];
