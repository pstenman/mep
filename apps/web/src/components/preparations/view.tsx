"use client";

import { useState } from "react";
import type { PrepGroup } from "@/lib/navigation/dashboard/types";
import { mapGroupToPrepType } from "@/utils/filters/prep-type-helpers";
import { PreparationTemplateSheet } from "./prep-templates/sheet";
import { ActivePrepView } from "./prep-lists/active-view";
import { TemplatesPrepView } from "./prep-templates/templates-view";

interface PreparationTemplateViewProps {
  group: PrepGroup | "all";
}

type ViewMode = "active" | "templates";

export function PreparationTemplateView({
  group,
}: PreparationTemplateViewProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("active");
  const type = group === "all" ? "all" : group;
  const prepType = mapGroupToPrepType("preparations", type);

  const handleTemplatesClick = () => {
    setViewMode("templates");
  };

  const handleBackClick = () => {
    setViewMode("active");
  };

  return (
    <>
      <div className="flex w-full">
        <div className="w-full px-3 py-4 md:px-6 lg:px-8 max-w-full lg:max-w-[794px]">
          {viewMode === "active" ? (
            <ActivePrepView
              prepType={prepType}
              onTemplatesClick={handleTemplatesClick}
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
