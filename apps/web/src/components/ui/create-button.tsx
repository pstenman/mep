"use client";

import { Plus } from "lucide-react";
import { useUserSheet } from "../users/sheet";
import { usePathname } from "next/navigation";
import { CreateRouteKeyEnum, createRoutes } from "@/lib/routes/create-routes";
import { DynamicButton } from "./dynamic-button";
import { usePreparationTemplateSheet } from "../preparations/sheet";
import { useMenusSheet } from "../menus/sheet";
import { useRecipesSheet } from "../recipes/sheet";

export function CreateButton() {
  const { open: openUserSheet } = useUserSheet();
  const { open: openPreparationTemplateSheet } = usePreparationTemplateSheet();
  const { open: openMenusSheet } = useMenusSheet();
  const { open: openRecipesSheet } = useRecipesSheet();
  const pathname = usePathname();
  const route = createRoutes.find((r) => r.match(pathname));

  const handleCreate = () => {
    switch (route?.key) {
      case CreateRouteKeyEnum.USER:
        openUserSheet();
        break;
      case CreateRouteKeyEnum.PREPARATION:
        openPreparationTemplateSheet();
        break;
      case CreateRouteKeyEnum.MENU:
        openMenusSheet();
        break;
      case CreateRouteKeyEnum.RECIPE:
        openRecipesSheet();
        break;
      default:
        return;
    }
  };

  if (!route) return null;

  return (
    <DynamicButton
      icon={Plus}
      tooltip={route.label}
      variant="default"
      className="rounded-full w-[40px] h-[40px]"
      size="icon"
      onClick={handleCreate}
    />
  );
}
