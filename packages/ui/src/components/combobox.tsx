"use client";

import { cn } from "../utils/cn";
import { useMemo, useState, useEffect } from "react";
import { Button } from "./button";
import { Check, ChevronsUpDown } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./command";

export type ComboboxOption<T = unknown> = {
  value: string;
  label: string;
  meta?: T;
};

export type ComboboxProps<T = unknown> = {
  value?: string;
  options: ComboboxOption<T>[];
  placeholder?: string;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  onValueChange?: (value: string) => void;
  onSelect?: (option: ComboboxOption<T>) => void;
};

function Combobox<T>({
  value,
  options,
  placeholder = "Select option...",
  disabled,
  loading,
  className,
  onValueChange,
  onSelect,
}: ComboboxProps<T>) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const selected = useMemo(() => {
    return options.find((option) => option.value === value);
  }, [options, value]);

  const filtered = useMemo(() => {
    if (!query) return options;
    return options.filter((o) =>
      o.label.toLowerCase().includes(query.toLowerCase()),
    );
  }, [options, query]);

  useEffect(() => {
    if (selected) {
      setQuery(selected.label);
    } else if (!value) {
      setQuery("");
    }
  }, [selected, value]);

  const handleSelect = (option: ComboboxOption<T>) => {
    setQuery(option.label);
    onValueChange?.(option.value);
    onSelect?.(option);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between", className)}
          disabled={disabled}
        >
          {selected?.label ?? placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className="w-[var(--radix-popover-trigger-width)] z-[12001] p-0"
        align="start"
      >
        <Command shouldFilter={false}>
          <CommandInput
            placeholder={placeholder}
            value={query}
            onValueChange={setQuery}
          />
          <CommandList>
            <CommandEmpty>
              {loading ? "Loading..." : "No results found."}
            </CommandEmpty>

            {filtered.length > 0 && (
              <CommandGroup>
                {filtered.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    onSelect={() => handleSelect(option)}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === option.value ? "opacity-100" : "opacity-0",
                      )}
                    />
                    {option.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export { Combobox };
