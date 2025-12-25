import type { GroupKey } from "@/lib/navigation/dashboard/types";
import { useTranslations } from "next-intl";
import { useMenusSheet } from "../menus/sheet";
import { Button, Text } from "@mep/ui";

interface EmptyStateProps {
  group: GroupKey | "all";
}

export function AllergiesEmptyState({ group }: EmptyStateProps) {
  const { open } = useMenusSheet();
  const t = useTranslations("menus");

  return (
    <div className="h-screen flex items-center justify-center flex-col space-y-6">
      <div className="flex items-center justify-center flex-col space-y-2 text-center">
        <Text className="text-2xl font-medium">
          {t("emptyState.title", { group: t(`group.${group as GroupKey}`) })}
        </Text>
        <Text>
          {t("emptyState.description", {
            group: t(`group.${group as GroupKey}`),
          })}
        </Text>
        <Button
          variant="outline"
          size="lg"
          className="hover:bg-primary/90 hover:text-primary-foreground hover:border-primary"
          onClick={() => open()}
        >
          {t("emptyState.button")}
        </Button>
      </div>
    </div>
  );
}
