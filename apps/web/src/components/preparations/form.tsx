"use client";

import type { PrepGroup } from "@/lib/navigation/dashboard/types";
import { PrepStatus } from "@mep/types";
import { trpc } from "@/lib/trpc/client";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import {
  mapGroupToPrepType,
  filterGroupsByPrepType,
} from "@/utils/filters/prep-type-helpers";
import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SheetFooter,
  useForm,
} from "@mep/ui";
import { PrepGroupCombobox } from "./autocomplete";
import { useTranslations } from "next-intl";

const formSchema = z.object({
  mode: z.enum(["group", "item"]),
  groupId: z.string().uuid().optional(),
  groupName: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  note: z.string().optional(),
  recipeId: z.string().uuid().optional(),
  status: z.nativeEnum(PrepStatus).optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface PreparationsFormProps {
  type: PrepGroup | "all";
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function PreparationsForm({
  type,
  onSuccess,
  onCancel,
}: PreparationsFormProps) {
  const utils = trpc.useUtils();
  const prepType = mapGroupToPrepType("preparations", type);
  const t = useTranslations("preparations.form");
  const [mode, setMode] = useState<"group" | "item">("group");

  // Fetch groups for combobox
  const { data: groupsData } = trpc.preparations.prepGroups.getAll.useQuery({
    filter: {},
  });

  // Filter groups by type
  const filteredGroups = filterGroupsByPrepType(
    "preparations",
    groupsData?.data.items,
    prepType,
  );

  // Fetch recipes for recipe selection
  const { data: recipesData } = trpc.recipes.getAll.useQuery({
    filter: {},
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      mode: "group",
      name: "",
      note: "",
      groupId: undefined,
      groupName: undefined,
      recipeId: undefined,
      status: undefined,
    },
  });

  const createGroup = trpc.preparations.prepGroups.create.useMutation({
    onSuccess: () => {
      utils.preparations.prepGroups.getAll.invalidate();
      toast.success("Group created successfully");
      onSuccess?.();
    },
    onError: () => {
      toast.error("Failed to create group");
    },
  });

  const createItem = trpc.preparations.prepItems.create.useMutation({
    onSuccess: () => {
      utils.preparations.prepItems.getAll.invalidate();
      utils.preparations.prepGroups.getAll.invalidate();
      toast.success("Item created successfully");
      onSuccess?.();
    },
    onError: () => {
      toast.error("Failed to create item");
    },
  });

  const onSubmit = async (data: FormValues) => {
    if (data.mode === "group") {
      const groupName = data.name;
      await createGroup.mutateAsync({
        name: groupName,
        prepTypes: prepType ? JSON.stringify([prepType]) : undefined,
        note: data.note,
      });
    } else {
      let finalGroupId = data.groupId;

      if (data.groupName && !data.groupId) {
        const newGroup = await createGroup.mutateAsync({
          name: data.groupName,
          prepTypes: prepType ? JSON.stringify([prepType]) : undefined,
        });
        finalGroupId = newGroup.data.id;
      }

      await createItem.mutateAsync({
        name: data.name,
        prepGroupId: finalGroupId,
        recipeId: data.recipeId,
        status: data.status,
      });
    }
  };

  const isLoading = createGroup.isPending || createItem.isPending;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="h-full flex flex-col"
      >
        <div className="flex-1 overflow-y-auto min-h-0 px-6 py-4">
          <div className="space-y-4">
            <FormField
              name="groupId"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("label.prepGroup")}</FormLabel>
                  <FormControl>
                    <PrepGroupCombobox
                      value={field.value}
                      placeholder={t("placeholder.prepGroup")}
                      onValueChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="mode"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Create</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value}
                      onValueChange={(value) => {
                        field.onChange(value);
                        setMode(value as "group" | "item");
                        form.reset({
                          ...form.getValues(),
                          mode: value as "group" | "item",
                          groupId: undefined,
                          groupName: undefined,
                          name: "",
                          note: "",
                          recipeId: undefined,
                          status: undefined,
                        });
                      }}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="group">Group</SelectItem>
                        <SelectItem value="item">Item</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {mode === "item" && (
              <>
                <FormField
                  name="groupId"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Group</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value ?? ""}
                          onValueChange={(value) => {
                            field.onChange(value);
                            form.setValue("groupName", undefined);
                          }}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a group" />
                          </SelectTrigger>
                          <SelectContent>
                            {filteredGroups.map((group) => {
                              const groupId = group.id as string | undefined;
                              const groupName = group.name as
                                | string
                                | undefined;
                              if (!groupId || !groupName) return null;
                              return (
                                <SelectItem key={groupId} value={groupId}>
                                  {groupName}
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  name="groupName"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Or create new group</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Enter group name"
                          value={field.value ?? ""}
                          onChange={(e) => {
                            field.onChange(e);
                            // Clear groupId when entering new group name
                            if (e.target.value) {
                              form.setValue("groupId", undefined);
                            }
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {mode === "group" ? "Group Name" : "Item Name"}
                  </FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {mode === "group" && (
              <FormField
                name="note"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Note</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Optional note" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {mode === "item" && (
              <>
                <FormField
                  name="recipeId"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Recipe (optional)</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value ?? ""}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a recipe" />
                          </SelectTrigger>
                          <SelectContent>
                            {recipesData?.data.items.map(
                              (recipe: { id: string; name: string }) => (
                                <SelectItem key={recipe.id} value={recipe.id}>
                                  {recipe.name}
                                </SelectItem>
                              ),
                            )}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  name="status"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value ?? ""}
                          onValueChange={(value) =>
                            field.onChange(value as PrepStatus)
                          }
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.values(PrepStatus).map((status) => (
                              <SelectItem key={status} value={status}>
                                {status}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
          </div>
        </div>
        <SheetFooter className="shrink-0 px-6 pb-4 pt-4 border-t">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            Create
          </Button>
        </SheetFooter>
      </form>
    </Form>
  );
}
