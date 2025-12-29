"use client";

import { trpc } from "@/lib/trpc/client";
import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Button, Checkbox, Text } from "@mep/ui";
import { PrepType } from "@mep/types";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const PREP_TYPES = [
  PrepType.MAIN,
  PrepType.BREAKFAST,
  PrepType.LUNCH,
  PrepType.ALACARTE,
  PrepType.SET,
  PrepType.GROUP,
] as const;

export function CompanyPanel() {
  const t = useTranslations("settings.company");
  const utils = trpc.useUtils();

  const { data: settingsData, isLoading } = trpc.companySettings.get.useQuery();

  const [enabledTypes, setEnabledTypes] = useState<PrepType[]>([]);

  useEffect(() => {
    if (settingsData?.data?.enabledPrepTypes) {
      setEnabledTypes(settingsData.data.enabledPrepTypes);
    }
  }, [settingsData]);

  const updateSettings = trpc.companySettings.update.useMutation({
    onSuccess: () => {
      utils.companySettings.get.invalidate();
      toast.success(t("updateSuccess") || "Settings updated successfully");
    },
    onError: (error: Error) => {
      toast.error(
        error.message || t("updateError") || "Failed to update settings",
      );
    },
  });

  const handleToggle = (prepType: PrepType) => {
    setEnabledTypes((prev) => {
      if (prev.includes(prepType)) {
        return prev.filter((type) => type !== prepType);
      } else {
        return [...prev, prepType];
      }
    });
  };

  const handleSave = () => {
    updateSettings.mutate({
      enabledPrepTypes: enabledTypes,
    });
  };

  const hasChanges =
    JSON.stringify(enabledTypes.sort()) !==
    JSON.stringify(settingsData?.data?.enabledPrepTypes?.sort() || []);

  if (isLoading) {
    return (
      <div className="flex items-center gap-2">
        <Loader2 className="w-4 h-4 animate-spin" />
        <Text>{t("loading") || "Loading settings..."}</Text>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <Text className="text-sm text-muted-foreground">
        {t("description") ||
          "Select which prep types should be available in your app."}
      </Text>

      <div className="space-y-3">
        {PREP_TYPES.map((prepType) => (
          <div key={prepType} className="flex items-center space-x-2">
            <Checkbox
              id={prepType}
              checked={enabledTypes.includes(prepType)}
              onCheckedChange={() => handleToggle(prepType)}
            />
            <label
              htmlFor={prepType}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
            >
              {t(`prepTypes.${prepType}`) || prepType}
            </label>
          </div>
        ))}
      </div>

      <Button
        onClick={handleSave}
        disabled={!hasChanges || updateSettings.isPending}
        className="mt-4"
      >
        {updateSettings.isPending ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            {t("saving") || "Saving..."}
          </>
        ) : (
          t("save") || "Save Changes"
        )}
      </Button>
    </div>
  );
}
