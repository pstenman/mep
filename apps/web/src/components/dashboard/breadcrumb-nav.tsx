"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@mep/ui";
import Link from "next/link";
import { ChevronRight, Dot, ChevronDownIcon } from "lucide-react";
import { useActiveNavGroup } from "@/lib/navigation/dashboard/hooks";

export function BreadcrumbNav() {
  const activeGroup = useActiveNavGroup();

  if (!activeGroup || !activeGroup.href) {
    return null;
  }

  const visibleSubItems = activeGroup.items || [];
  const activeSubItem = activeGroup.activeItem;

  return (
    <Breadcrumb className="text-sm">
      <BreadcrumbList>
        <BreadcrumbItem>
          {visibleSubItems.length > 0 ? (
            <>
              <BreadcrumbLink asChild className="hidden md:inline-flex">
                <Link href={activeGroup.href} className="font-semibold">
                  {activeGroup.title}
                </Link>
              </BreadcrumbLink>
              <DropdownMenu>
                <DropdownMenuTrigger className="md:hidden flex items-center gap-1 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-3.5 font-semibold">
                  {activeGroup.title}
                  <ChevronRight size={12} className="text-muted-foreground" />
                  {activeSubItem?.label || visibleSubItems[0]?.label}
                  <ChevronDownIcon size={12} />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  {visibleSubItems.map((subItem) => (
                    <DropdownMenuItem key={subItem.id} asChild>
                      <Link href={subItem.href}>{subItem.label}</Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <BreadcrumbLink asChild>
              <Link href={activeGroup.href} className="font-semibold">
                {activeGroup.title}
              </Link>
            </BreadcrumbLink>
          )}
        </BreadcrumbItem>
        {visibleSubItems.length > 0 && (
          <>
            <BreadcrumbSeparator className="hidden md:flex">
              <ChevronRight size={12} />
            </BreadcrumbSeparator>
            {visibleSubItems.flatMap((subItem, index) => {
              const isLast = index === visibleSubItems.length - 1;

              const items = [
                <BreadcrumbItem key={subItem.id} className="hidden md:block">
                  <BreadcrumbLink asChild>
                    <Link
                      href={subItem.href}
                      className={
                        subItem.isActive ? "font-medium text-foreground" : ""
                      }
                    >
                      {subItem.label}
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>,
              ];

              if (!isLast) {
                items.push(
                  <BreadcrumbSeparator
                    key={`${subItem.id}-separator`}
                    className="mx-1.5 hidden md:flex"
                  >
                    <Dot size={12} />
                  </BreadcrumbSeparator>,
                );
              }

              return items;
            })}
          </>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
