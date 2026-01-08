import type { PrepGroup } from "@/lib/navigation/dashboard/types";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@mep/ui";
import { useParams } from "next/navigation";
import { parseAsBoolean, parseAsString } from "nuqs";
import { useQueryState } from "nuqs";
import { PreparationTemplateForm } from "./form";
import { useTranslations } from "next-intl";

export const usePreparationTemplateSheet = () => {
  const [isOpen, setIsOpen] = useQueryState(
    "preparationsSheetOpen",
    parseAsBoolean.withDefault(false),
  );
  const [templateId, setTemplateId] = useQueryState(
    "templateId",
    parseAsString.withDefault(""),
  );

  const open = (id?: string) => {
    setTemplateId(id || "");
    setIsOpen(true);
  };

  const close = () => {
    setTemplateId("");
    setIsOpen(false);
  };

  return {
    isOpen,
    open,
    close,
    templateId: templateId || null,
  };
};

export function PreparationTemplateSheet() {
  const t = useTranslations("preparations");
  const { isOpen, close, templateId } = usePreparationTemplateSheet();
  const params = useParams();
  const group = (params?.group as PrepGroup) || "all";

  const handleSuccess = () => {
    close();
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && close()}>
      <SheetContent className="flex flex-col p-0">
        <SheetHeader className="px-6 pt-6 pb-4 border-b shrink-0">
          <SheetTitle>
            {templateId
              ? t("templates.sheet.edit")
              : t("templates.sheet.create")}
          </SheetTitle>
        </SheetHeader>
        <div className="flex-1 min-h-0">
          <PreparationTemplateForm
            type={group}
            templateId={templateId}
            onSuccess={handleSuccess}
            onCancel={close}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
