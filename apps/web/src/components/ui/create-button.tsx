"use client";

import { Plus } from "lucide-react";
import { useUserSheet } from "../users/sheet";
import { usePathname } from "next/navigation";
import { CreateRouteKeyEnum, createRoutes } from "@/lib/routes/create-routes";
import { DynamicButton } from "./dynamic-button";
import { usePreparationTemplateSheet } from "../preparations/prep-templates/sheet";
import { useMenusSheet } from "../menus/sheet";
import { useRecipesSheet } from "../recipes/sheet";
import { useOrderAddForm } from "../orders/view";
import { useTranslations } from "next-intl";

export function CreateButton() {
  const t = useTranslations("common");
  const { open: openUserSheet } = useUserSheet();
  const { open: openPreparationTemplateSheet } = usePreparationTemplateSheet();
  const { open: openMenusSheet } = useMenusSheet();
  const { open: openRecipesSheet } = useRecipesSheet();
  const { open: openOrderAddForm } = useOrderAddForm();
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
      case CreateRouteKeyEnum.ORDER:
        openOrderAddForm();
        break;
      default:
        return;
    }
  };

  if (!route) return null;

  const tooltip = t(`createButton.${route.key}`);

  return (
    <DynamicButton
      icon={Plus}
      tooltip={tooltip}
      variant="default"
      className="rounded-full w-[40px] h-[40px]"
      size="icon"
      onClick={handleCreate}
    />
  );
}
