"use client";

import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@mep/ui";
import clsx from "clsx";
import { Languages, Check } from "lucide-react";

type Locale = "sv" | "en";

type LanguageSelectProps = {
  className?: string;
};

const OPTIONS: { value: Locale; label: string; flag: string }[] = [
  { value: "sv", label: "Svenska", flag: "🇸🇪" },
  { value: "en", label: "English", flag: "🇬🇧" },
];

export function LanguageSelect({ className }: LanguageSelectProps) {
  const locale = useLocale();
  const router = useRouter();

  const handleChange = (newLocale: string) => {
    Cookies.set("locale", newLocale, { expires: 365 });
    router.refresh();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className={clsx(
            "flex items-center gap-2 text-xs justify-center",
            className,
          )}
        >
          <Languages size={14} />
          <span className="capitalize">
            {OPTIONS.find((opt) => opt.value === locale)?.label}
          </span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" className="w-44">
        {OPTIONS.map((opt) => (
          <DropdownMenuItem
            key={opt.value}
            onClick={() => handleChange(opt.value)}
            className="flex items-center gap-2"
          >
            <span>{opt.flag}</span>
            <span>{opt.label}</span>
            <Check
              size={14}
              className={clsx(
                "ml-auto text-primary transition-opacity",
                locale === opt.value ? "opacity-100" : "opacity-0",
              )}
            />
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
