"use client";

import { Combobox, type ComboboxOption } from "@mep/ui";
import { trpc } from "@/lib/trpc/client";
import { useMemo } from "react";
import type { PrepGroup } from "@/lib/navigation/dashboard/types";
import type { PrepGroupOutput } from "@mep/api";

export type PrepGroupComboboxProps = {
  value?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  onValueChange?: (value: string) => void;
  onSelect?: (option: ComboboxOption<PrepGroupOutput>) => void;
};

export function PrepGroupCombobox({
  value,
  placeholder,
  disabled,
  className,
  onValueChange,
  onSelect,
}: PrepGroupComboboxProps) {
  const { data, isLoading } = trpc.preparations.prepGroups.getAll.useQuery({
    filter: {},
  });

  const options: ComboboxOption<PrepGroup>[] = useMemo(() => {
    if (!data?.data.items) return [];
    return data.data.items.map((prepGroup: PrepGroupOutput) => ({
      value: prepGroup.id,
      label: prepGroup.name,
      meta: prepGroup,
    }));
  }, [data]);

  return (
    <Combobox
      value={value}
      options={options}
      placeholder={placeholder}
      disabled={disabled}
      loading={isLoading}
      className={className}
      onValueChange={onValueChange}
      onSelect={onSelect}
    />
  );
}
