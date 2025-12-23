"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
  useIsMobile,
  SidebarHeader,
  cn,
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarFooter,
} from "@mep/ui";
import { ChevronDown } from "lucide-react";
import Link from "next/link";

import { useDashboardNavigation } from "@/hooks/use-dashboard-navigation";
import { UserMenu } from "./user-settings";
import type { DashboardPath } from "@/utils/nav-path/dashboard-prefix";

export function DashboardSidebar() {
  const { state } = useSidebar();
  const isMobile = useIsMobile();
  const menuItems = useDashboardNavigation();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-siderbar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div
                className={cn(
                  "text-center transition-all",
                  state === "collapsed" && !isMobile
                    ? "flex justify-center items-center w-full"
                    : "px-[4px]",
                )}
              >
                <Link href="/">
                  <p className="font-medium text-[22px]">
                    {state === "expanded" || isMobile ? "Mep" : "M."}
                  </p>
                </Link>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu className={state === "collapsed" ? "gap-4" : "gap-1"}>
            {menuItems.map((item) =>
              item.collapsible && item.items?.length ? (
                <Collapsible
                  key={item.id}
                  asChild
                  defaultOpen={item.isActive}
                  className="group/collapsible"
                >
                  <SidebarMenuItem className="p-0">
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton
                        tooltip={item.title}
                        className={cn(
                          "hover:bg-subtle-pale dark:hover:bg-gray-700",
                          item.isActive && "bg-accent-pale dark:bg-gray-800",
                        )}
                      >
                        {item.icon && (
                          <Link href={item.href as DashboardPath}>
                            <item.icon
                              size={20}
                              className={cn(
                                "m-[6px]",
                                item.isActive &&
                                  "stroke-accent-base dark:stroke-white",
                              )}
                            />
                          </Link>
                        )}
                        <span className="text-xs">{item.title}</span>
                        <ChevronDown
                          size={16}
                          className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-180"
                        />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>

                    <CollapsibleContent>
                      <SidebarMenuSub className="mx-0 px-0 border-l-0 w-full gap-0">
                        {item.items.map((subItem) => (
                          <SidebarMenuSubItem key={subItem.id}>
                            <SidebarMenuButton asChild>
                              <Link
                                href={subItem.href}
                                className={cn(
                                  "hover:bg-subtle-pale dark:hover:bg-gray-700 pl-[48px]",
                                  subItem.isActive &&
                                    "bg-accent-pale dark:bg-gray-800",
                                )}
                              >
                                <span className="text-xs">{subItem.label}</span>
                              </Link>
                            </SidebarMenuButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              ) : (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    tooltip={item.title}
                    asChild
                    className={cn(
                      "hover:bg-subtle-pale dark:hover:bg-gray-700",
                      item.isActive &&
                        "bg-accent-pale dark:bg-gray-800 font-medium",
                    )}
                  >
                    <Link
                      href={item.href as DashboardPath}
                      className="flex items-center gap-2"
                    >
                      {item.icon && (
                        <item.icon
                          size={20}
                          className={cn(
                            "m-[6px]",
                            item.isActive &&
                              "stroke-accent-base dark:stroke-white",
                          )}
                        />
                      )}
                      <span className="text-xs">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ),
            )}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <UserMenu />
      </SidebarFooter>
    </Sidebar>
  );
}
