import type { PrepGroup } from "@/lib/navigation/dashboard/types";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@mep/ui";
import { useParams } from "next/navigation";
import { parseAsBoolean } from "nuqs";
import { useQueryState } from "nuqs";
import { PreparationTemplateForm } from "./form";

export const usePreparationTemplateSheet = () => {
  const [isOpen, setIsOpen] = useQueryState(
    "preparationsSheetOpen",
    parseAsBoolean.withDefault(false),
  );

  const open = () => {
    setIsOpen(true);
  };

  const close = () => {
    setIsOpen(false);
  };

  return { isOpen, open, close };
};

export function PreparationTemplateSheet() {
  const { isOpen, close } = usePreparationTemplateSheet();
  const params = useParams();
  const group = (params?.group as PrepGroup) || "all";

  const handleSuccess = () => {
    close();
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && close()}>
      <SheetContent className="flex flex-col p-0">
        <SheetHeader className="px-6 pt-6 pb-4 border-b shrink-0">
          <SheetTitle>Create Preparation</SheetTitle>
        </SheetHeader>
        <div className="flex-1 min-h-0">
          <PreparationTemplateForm
            type={group}
            onSuccess={handleSuccess}
            onCancel={close}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
