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
    ],
  },

  {
    id: "menues",
    titleKey: "menues",
    href: dashboardPrefix("menues/menu"),
    icon: BookOpenText,
    collapsible: true,
    items: [
      {
        id: "menu-main",
        labelKey: "menu",
        href: dashboardPrefix("menues/menu"),
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
    ],
  },
];
