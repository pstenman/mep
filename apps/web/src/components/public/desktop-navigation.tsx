"use client";

import { useTranslations } from "next-intl";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@mep/ui";
import Link from "next/link";
import { navLinks } from "@/lib/navigation/public/public-nav";

export function DesktopNavigation() {
  const t = useTranslations("public");

  const handleAnchorClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  return (
    <NavigationMenu>
      <NavigationMenuList className="gap-6">
        {navLinks.map((link) => (
          <NavigationMenuItem key={link.labelKey}>
            <NavigationMenuLink asChild>
              <Link
                href={link.href}
                className="text-sm hover:underline"
                onClick={(e) => handleAnchorClick(e, link.href)}
              >
                {t(link.labelKey)}
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
