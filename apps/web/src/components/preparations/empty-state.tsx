import type { PrepGroup } from "@/lib/navigation/dashboard/types";
import { Text, Button } from "@mep/ui";
import { usePreparationTemplateSheet } from "./prep-templates/sheet";
import { useTranslations } from "next-intl";

interface EmptyStateProps {
  group: PrepGroup;
}

export function EmptyState({ group }: EmptyStateProps) {
  const { open } = usePreparationTemplateSheet();
  const t = useTranslations("preparations");

  return (
    <div className="h-screen flex items-center justify-center flex-col space-y-6">
      <div className="flex items-center justify-center flex-col space-y-2 text-center">
        <Text className="text-2xl font-medium">
          {t("emptyState.title", { group: t(`group.${group}`) })}
        </Text>
        <Text>
          {t("emptyState.description", { group: t(`group.${group}`) })}
        </Text>
        <Button
          variant="outline"
          size="lg"
          className="hover:bg-primary/90 hover:text-primary-foreground hover:border-primary"
          onClick={open}
        >
          {t("emptyState.button")}
        </Button>
      </div>
    </div>
  );
}
