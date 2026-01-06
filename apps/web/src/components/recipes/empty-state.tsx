"use client";

import { Text, Button } from "@mep/ui";
import { useRecipesSheet } from "./sheet";
import { useTranslations } from "next-intl";

export function EmptyState() {
  const { open } = useRecipesSheet();
  const t = useTranslations("recipes");

  return (
    <div className="h-screen flex items-center justify-center flex-col space-y-6">
      <div className="flex items-center justify-center flex-col space-y-2 text-center">
        <Text className="text-2xl font-medium">{t("empty.title")}</Text>
        <Text>{t("empty.description")}</Text>
        <Button
          variant="outline"
          size="lg"
          className="hover:bg-primary/90 hover:text-primary-foreground hover:border-primary"
          onClick={() => open()}
        >
          {t("empty.button")}
        </Button>
      </div>
    </div>
  );
}
