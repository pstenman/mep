"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { trpc } from "@/lib/trpc/client";
import { MenuType, type MenuCategory, PrepType } from "@mep/types";
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
  Checkbox,
  Text,
} from "@mep/ui";
import type { MenuItemOutput, AllergyOutput } from "@mep/api";
import { useMenusSheet } from "./sheet";
import { MenuFieldArray } from "./field-array";
import { useEffect, useMemo } from "react";

interface MenuFormProps {
  onSuccess?: () => void;
  onCancel: () => void;
}

const prepTypeToMenuType = (prepType: PrepType): MenuType | null => {
  const mapping: Partial<Record<PrepType, MenuType>> = {
    [PrepType.BREAKFAST]: MenuType.BREAKFAST,
    [PrepType.LUNCH]: MenuType.LUNCH,
    [PrepType.ALACARTE]: MenuType.ALACARTE,
    [PrepType.SET]: MenuType.SET,
    [PrepType.GROUP]: MenuType.GROUP,
  };
  return mapping[prepType] || null;
};

export function MenuForm({ onSuccess, onCancel: _onCancel }: MenuFormProps) {
  const t = useTranslations("menus");
  const utils = trpc.useUtils();
  const { menuId } = useMenusSheet();

  const { data: allergies } = trpc.allergies.getAll.useQuery({});
  const { data: companySettings } = trpc.companySettings.get.useQuery();

  const { data: menuData } = trpc.menus.getById.useQuery(
    { id: menuId! },
    { enabled: !!menuId },
  );

  const allowedMenuTypes = useMemo(() => {
    if (!companySettings?.data?.enabledPrepTypes) {
      return Object.values(MenuType);
    }

    const enabledMenuTypes = companySettings.data.enabledPrepTypes
      .map(prepTypeToMenuType)
      .filter((type: MenuType | null) => type !== null);

    const types =
      enabledMenuTypes.length > 0 ? enabledMenuTypes : Object.values(MenuType);

    if (
      menuId &&
      menuData?.data?.menuType &&
      !types.includes(menuData.data.menuType)
    ) {
      return [...types, menuData.data.menuType];
    }

    return types;
  }, [companySettings, menuId, menuData]);

  const schema = menuFormSchema(t);
  const defaultMenuType = allowedMenuTypes[0] || MenuType.BREAKFAST;

  const form = useForm<MenuFormSchema>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      menuType: defaultMenuType,
      isActive: false,
      menuItems: [],
    },
  });

  useEffect(() => {
    if (menuData?.data) {
      form.reset({
        name: menuData.data.name,
        menuType: menuData.data.menuType,
        isActive: menuData.data.isActive ?? false,
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
      toast.success(t("form.toast.createSuccess"));
      utils.menus.getAll.invalidate();
      onSuccess?.();
    },
  });

  const updateMenu = trpc.menus.update.useMutation({
    onSuccess: () => {
      toast.success(t("form.toast.updateSuccess"));
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
        isActive: data.isActive,
        menuItems: menuItemsPayload,
      });
    } else {
      createMenu.mutate({
        name: data.name,
        menuType: data.menuType,
        isActive: data.isActive,
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
                  <FormLabel>{t("form.label.name")}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder={t("form.placeholder.name")}
                    />
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
                  <FormLabel>{t("form.label.menuType")}</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={t("form.placeholder.menuType")}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {allowedMenuTypes.map((type: MenuType) => (
                          <SelectItem key={type} value={type}>
                            {t(`form.menuType.${type}`)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="isActive"
              control={form.control}
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>{t("form.label.isActive")}</FormLabel>
                    <Text className="text-sm text-muted-foreground">
                      {t("form.description.isActive")}
                    </Text>
                  </div>
                </FormItem>
              )}
            />

            <MenuFieldArray form={form} allergies={allergens} />
          </div>
        </div>
        <SheetFooter className="shrink-0 px-6 pb-4 pt-4 border-t">
          <Button type="submit" disabled={isLoading}>
            {isLoading
              ? t("form.button.saving")
              : menuId
                ? t("form.button.update")
                : t("form.button.create")}
          </Button>
        </SheetFooter>
      </form>
    </Form>
  );
}
