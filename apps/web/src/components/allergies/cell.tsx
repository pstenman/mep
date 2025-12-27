import type { AllergyOutput, FormattedMenuItem } from "@mep/api";
import type { Allergen } from "@mep/types";
import type { Row } from "@tanstack/react-table";
import { trpc } from "@/lib/trpc/client";
import { Checkbox } from "@mep/ui";

interface AllergiesCellProps {
  row: Row<FormattedMenuItem>;
  allergy: Allergen;
  menuId: string;
}

export function AllergiesCell({ row, allergy, menuId }: AllergiesCellProps) {
  const utils = trpc.useUtils();
  const { data: allergiesData } = trpc.allergies.getAll.useQuery();

  const mutation = trpc.menuItems.update.useMutation({
    onMutate: async (variables: {
      id: string;
      name: string;
      allergyIds?: string[];
    }) => {
      const { id, allergyIds } = variables;
      await utils.menuItems.getAll.cancel();
      const previous = utils.menuItems.getAll.getData({
        filter: { menuId },
      });

      if (previous) {
        const allergyNames =
          allergiesData?.data.items
            .filter((a: AllergyOutput) => allergyIds?.includes(a.id))
            .map((a: AllergyOutput) => a.name as Allergen) ?? [];

        utils.menuItems.getAll.setData(
          { filter: { menuId } },
          {
            ...previous,
            data: previous.data.map((item: FormattedMenuItem) =>
              item.id === id ? { ...item, allergies: allergyNames } : item,
            ),
          },
        );
      }

      return { previous };
    },

    onError: (
      _error: Error,
      _variables: { id: string; name: string; allergyIds?: string[] },
      context?: { previous: { data: FormattedMenuItem[] } | undefined },
    ) => {
      if (context?.previous) {
        utils.menuItems.getAll.setData(
          { filter: { menuId } },
          context.previous,
        );
      }
    },

    onSettled: () => {
      utils.menuItems.getAll.invalidate({ filter: { menuId } });
    },
  });

  const hasAllergy = row.original.allergies.includes(allergy);
  const allergyId = allergiesData?.data.items.find(
    (a: AllergyOutput) => a.name === allergy,
  )?.id;

  const handleCheckedChange = (checked: boolean) => {
    if (!allergyId) return;

    const currentAllergyIds = row.original.allergies
      .map(
        (name) =>
          allergiesData?.data.items.find((a: AllergyOutput) => a.name === name)
            ?.id,
      )
      .filter((id): id is string => Boolean(id));

    mutation.mutate({
      id: row.original.id,
      name: row.original.name,
      allergyIds: checked
        ? [...currentAllergyIds, allergyId]
        : currentAllergyIds.filter((id) => id !== allergyId),
    });
  };

  return (
    <div className="flex items-center justify-center w-full h-full">
      <Checkbox
        checked={hasAllergy}
        disabled={mutation.isPending}
        onCheckedChange={handleCheckedChange}
      />
    </div>
  );
}
