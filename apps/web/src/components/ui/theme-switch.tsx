"use client";

import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Text,
} from "@mep/ui";
import clsx from "clsx";
import { Check, Globe, Moon, Sun } from "lucide-react";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";

type Theme = "dark" | "system" | "light";

type ThemeProps = {
  currentTheme?: Theme;
};

const ThemeIcon = ({ currentTheme }: ThemeProps) => {
  switch (currentTheme) {
    case "dark":
      return <Moon size={12} />;
    case "system":
      return <Globe size={12} />;
    default:
      return <Sun size={12} />;
  }
};

export function ThemeSwitch() {
  const { theme, setTheme } = useTheme();
  const currentTheme: Theme = (theme as Theme) ?? "system";
  const t = useTranslations("common");

  const items: { value: Theme; label: string; icon: React.ReactNode }[] = [
    { value: "light", label: t("light"), icon: <Sun size={14} /> },
    { value: "dark", label: t("dark"), icon: <Moon size={14} /> },
    { value: "system", label: t("system"), icon: <Globe size={14} /> },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center gap-2 text-xs justify-center"
        >
          <ThemeIcon currentTheme={currentTheme} />
          <span className="capitalize">{t(currentTheme)}</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" className="w-44">
        {items.map((item) => (
          <DropdownMenuItem
            key={item.value}
            onClick={() => setTheme(item.value)}
            className="flex items-center gap-2"
          >
            {item.icon}
            <Text>{item.label}</Text>
            <Check
              size={14}
              className={clsx(
                "ml-auto text-primary transition-opacity",
                currentTheme === item.value ? "opacity-100" : "opacity-0",
              )}
            />
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
