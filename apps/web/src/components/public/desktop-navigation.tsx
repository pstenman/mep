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

  return (
    <NavigationMenu>
      <NavigationMenuList className="gap-6">
        {navLinks.map((link) => (
          <NavigationMenuItem key={link.labelKey}>
            <NavigationMenuLink asChild>
              <Link href={link.href} className="text-sm hover:underline">
                {t(link.labelKey)}
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
