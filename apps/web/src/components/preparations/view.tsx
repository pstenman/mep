"use client";

import { useState } from "react";
import type { PrepGroup } from "@/lib/navigation/dashboard/types";
import { mapGroupToPrepType } from "@/utils/filters/prep-type-helpers";
import { PreparationTemplateSheet } from "./sheet";
import { ActivePrepView } from "./active-view";
import { TemplatesPrepView } from "./templates-view";

interface PreparationTemplateViewProps {
  group: PrepGroup | "all";
}

type ViewMode = "active" | "old";

export function PreparationTemplateView({
  group,
}: PreparationTemplateViewProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("active");
  const type = group === "all" ? "all" : group;
  const prepType = mapGroupToPrepType("preparations", type);

  const handleHistoryClick = () => {
    setViewMode("old");
  };

  const handleBackClick = () => {
    setViewMode("active");
  };

  return (
    <>
      <div className="flex w-full justify-center">
        <div className="w-full px-3 py-4 md:px-6 lg:px-8 max-w-full lg:max-w-[794px]">
          {viewMode === "active" ? (
            <ActivePrepView
              prepType={prepType}
              onHistoryClick={handleHistoryClick}
            />
          ) : (
            <TemplatesPrepView
              prepType={prepType}
              onBackClick={handleBackClick}
            />
          )}
        </div>
      </div>
      <PreparationTemplateSheet />
    </>
  );
}
