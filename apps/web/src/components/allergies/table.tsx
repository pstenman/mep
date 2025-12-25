"use client";

import { trpc } from "@/lib/trpc/client";
import {
  useIsMobile,
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@mep/ui";
import { useMemo, useState } from "react";
import { Loader2 } from "lucide-react";

interface AllergiesTableProps {
  menuId: string;
  onEditMenuItem: (menuItemId: string) => void;
  onDeleteMenuItem: (menuItemId: string) => void;
}

interface FormattedMenuItem {
  id: string;
  name: string;
  category?: string | null;
  allergies: string[];
}

export function AllergiesTable({
  menuId,
  onEditMenuItem,
  onDeleteMenuItem,
}: AllergiesTableProps) {
  const isMobile = useIsMobile();
  const [selectedItem, setSelectedItem] = useState<FormattedMenuItem | null>(
    null,
  );

  const { data: allergiesData, isLoading: isLoadingAllergies } =
    trpc.allergies.getAll.useQuery({
      filter: {},
    });

  const { data: menuItemsData, isLoading: isLoadingMenuItems } =
    trpc.menuItems.getAll.useQuery({
      filter: { menuId },
    });

  const menuItems: FormattedMenuItem[] = useMemo(
    () =>
      menuItemsData?.data.items.map(
        (item: {
          id: string;
          name: string;
          category: string | null;
          allergies?: string[];
        }) => ({
          id: item.id,
          name: item.name,
          category: item.category,
          allergies: item.allergies ?? [],
        }),
      ) ?? [],
    [menuItemsData],
  );

  const allAllergies = allergiesData?.data.items ?? [];

  const isLoading = isLoadingAllergies || isLoadingMenuItems;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  if (isMobile) {
    return (
      <>
        <div className="space-y-2">
          {menuItems.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No menu items found
            </div>
          ) : (
            menuItems.map((item) => (
              <div
                key={item.id}
                className="w-full border rounded-lg p-3 flex justify-between items-center"
              >
                <div>
                  <div>{item.name}</div>
                  {item.category && (
                    <div className="text-sm text-muted-foreground">
                      {item.category}
                    </div>
                  )}
                </div>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setSelectedItem(item)}
                >
                  Allergies
                </Button>
              </div>
            ))
          )}
        </div>

        {selectedItem && (
          <Dialog
            open={!!selectedItem}
            onOpenChange={() => setSelectedItem(null)}
          >
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{selectedItem.name} - Allergies</DialogTitle>
              </DialogHeader>
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedItem.allergies.length === 0 ? (
                  <span className="text-sm text-muted-foreground">
                    No allergies
                  </span>
                ) : (
                  selectedItem.allergies.map((allergy) => (
                    <span
                      key={allergy}
                      className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 text-sm rounded-full"
                    >
                      {allergy}
                    </span>
                  ))
                )}
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    onEditMenuItem(selectedItem.id);
                    setSelectedItem(null);
                  }}
                >
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    onDeleteMenuItem(selectedItem.id);
                    setSelectedItem(null);
                  }}
                >
                  Delete
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </>
    );
  }

  return (
    <div className=" w-full h-screen border rounded-lg p-0 shadow-md bg-background flex flex-col mt-4">
      <div className="overflow-x-auto">
        {menuItems.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No menu items found
          </div>
        ) : (
          <table>
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-800">
                <th className="text-left">Dish</th>
                {allAllergies.map(
                  (
                    allergy: NonNullable<
                      typeof allergiesData.data.items
                    >[number],
                  ) => (
                    <th key={allergy.id} className="text-center">
                      {allergy.name}
                    </th>
                  ),
                )}
                <th className="border px-2 py-1 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {menuItems.map((item) => (
                <tr key={item.id} className="hover:bg-accent/50">
                  <td className="border px-2 py-1">{item.name}</td>
                  {allAllergies.map(
                    (
                      allergy: NonNullable<
                        typeof allergiesData.data.items
                      >[number],
                    ) => (
                      <td
                        key={allergy.id}
                        className="border px-2 py-1 text-center"
                      >
                        {item.allergies.includes(allergy.name) ? "✔️" : ""}
                      </td>
                    ),
                  )}
                  <td className="border px-2 py-1">
                    <div className="flex gap-1 justify-center">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onEditMenuItem(item.id)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => onDeleteMenuItem(item.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
