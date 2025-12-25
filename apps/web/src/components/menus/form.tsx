"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { trpc } from "@/lib/trpc/client";
import { MenuType, type MenuCategory } from "@mep/types";
import { toast } from "sonner";
import { menuFormSchema, type MenuFormSchema } from "./schema";
import { useTranslations } from "next-intl";
import {
  Form,
  FormLabel,
  FormControl,
  FormMessage,
  FormItem,
  Input,
  useForm,
  FormField,
  Select,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectItem,
  Button,
  SheetFooter,
} from "@mep/ui";
import type { MenuItemOutput, AllergyOutput } from "@mep/api";
import { useMenusSheet } from "./sheet";
import { MenuFieldArray } from "./field-array";
import { useEffect } from "react";

interface MenuFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function MenuForm({ onSuccess, onCancel }: MenuFormProps) {
  const t = useTranslations("menus");
  const utils = trpc.useUtils();
  const { menuId } = useMenusSheet();

  const { data: allergies } = trpc.allergies.getAll.useQuery({});

  const { data: menuData } = trpc.menus.getById.useQuery(
    { id: menuId! },
    { enabled: !!menuId },
  );

  const schema = menuFormSchema(t);
  const form = useForm<MenuFormSchema>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      menuType: MenuType.ALACARTE,
      menuItems: [],
    },
  });

  useEffect(() => {
    if (menuData?.data) {
      form.reset({
        name: menuData.data.name,
        menuType: menuData.data.menuType,
        menuItems: (menuData.data.menuItems || []).map(
          (item: MenuItemOutput) => ({
            name: item.name,
            category: item.category as MenuCategory,
            description: item.description || "",
            allergies:
              item.allergies?.map((allergy: AllergyOutput) => allergy.id) || [],
          }),
        ),
      });
    }
  }, [menuData, form]);

  const createMenu = trpc.menus.create.useMutation({
    onSuccess: () => {
      toast.success("Menu created successfully");
      utils.menus.getAll.invalidate();
      onSuccess?.();
    },
  });

  const updateMenu = trpc.menus.update.useMutation({
    onSuccess: () => {
      toast.success("Menu updated successfully");
      utils.menus.getAll.invalidate();
      onSuccess?.();
    },
  });

  const onSubmit = (data: MenuFormSchema) => {
    const menuItemsPayload = data.menuItems.map((item) => ({
      name: item.name,
      category: item.category,
      description: item.description || undefined,
      allergyIds: item.allergies.length > 0 ? item.allergies : [],
    }));

    if (menuId) {
      updateMenu.mutate({
        id: menuId,
        name: data.name,
        menuType: data.menuType,
        menuItems: menuItemsPayload,
      });
    } else {
      createMenu.mutate({
        name: data.name,
        menuType: data.menuType,
        menuItems: menuItemsPayload,
      });
    }
  };

  const allergens = allergies?.data.items || [];
  const isLoading = createMenu.isPending || updateMenu.isPending;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="h-full flex flex-col"
      >
        <div className="flex-1 overflow-y-auto min-h-0 px-6 py-4">
          <div className="space-y-4">
            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Menu Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter menu name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="menuType"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Menu Type</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select menu type" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(MenuType).map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <MenuFieldArray form={form} allergies={allergens} />
          </div>
        </div>
        <SheetFooter className="shrink-0 px-6 pb-4 pt-4 border-t">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : menuId ? "Update" : "Create"}
          </Button>
        </SheetFooter>
      </form>
    </Form>
  );
}
