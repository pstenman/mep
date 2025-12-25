import { trpc } from "@/lib/trpc/client";
import { useMemo } from "react";
import type { Allergen } from "@mep/types";
import type { AllergyOutput, FormattedMenuItem } from "@mep/api";

export const useMenuItemsWithAllergies = (
  menuId: string | null | undefined,
) => {
  const { data: allergiesData } = trpc.allergies.getAll.useQuery();

  const { data: menuItemsData } = trpc.menuItems.getAll.useQuery(
    { filter: { menuId: menuId ?? undefined } },
    { enabled: !!menuId },
  );

  const menuItems: FormattedMenuItem[] = useMemo(
    () => menuItemsData?.data ?? [],
    [menuItemsData],
  );

  const allAllergies: Allergen[] = useMemo(() => {
    return (
      allergiesData?.data.items.map(
        (allergy: AllergyOutput) => allergy.name as Allergen,
      ) ?? []
    );
  }, [allergiesData]);

  return {
    menuItems,
    allAllergies,
  };
};
