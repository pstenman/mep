import { navLinks } from "@/lib/navigation/public/public-nav";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@mep/ui";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { LanguageSelect } from "../language-select";

export function PublicSidebar() {
  const t = useTranslations("public");

  return (
    <Sidebar
      collapsible="icon"
      className="bg-background dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 w-64 md:hidden"
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/">Mep</Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {navLinks.map((link) => (
              <SidebarMenuItem key={link.labelKey}>
                <SidebarMenuButton asChild>
                  <Link href={link.href}>{t(link.labelKey)}</Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarSeparator />

      <SidebarFooter className="px-4 py-2">
        <LanguageSelect className="w-full" />
      </SidebarFooter>
    </Sidebar>
  );
}
