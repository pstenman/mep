"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@mep/ui";
import Link from "next/link";
import { ChevronRight, Dot } from "lucide-react";
import { useActiveNavGroup } from "@/hooks/use-dashboard-navigation";

export function BreadcrumbNav() {
  const activeGroup = useActiveNavGroup();

  if (!activeGroup) {
    return null;
  }

  const visibleSubItems = activeGroup.items || [];

  return (
    <Breadcrumb className="text-sm">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href={activeGroup.href} className="font-semibold">
              {activeGroup.title}
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        {visibleSubItems.length > 0 && (
          <>
            <BreadcrumbSeparator>
              <ChevronRight />
            </BreadcrumbSeparator>
            {visibleSubItems.flatMap((subItem, index) => {
              const isLast = index === visibleSubItems.length - 1;

              const items = [
                <BreadcrumbItem key={subItem.id}>
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
                    className="mx-1.5"
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
