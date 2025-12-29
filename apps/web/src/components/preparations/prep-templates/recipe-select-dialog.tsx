"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Button,
} from "@mep/ui";
import { RecipeCombobox } from "@/components/recipes/autocomplete";
import { X } from "lucide-react";

interface RecipeSelectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedRecipeId?: string;
  onSelect: (recipeId: string) => void;
  onClear?: () => void;
}

export function RecipeSelectDialog({
  open,
  onOpenChange,
  selectedRecipeId,
  onSelect,
  onClear,
}: RecipeSelectDialogProps) {
  const handleSelect = (recipeId: string) => {
    onSelect(recipeId);
    onOpenChange(false);
  };

  const handleClear = () => {
    onClear?.();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Select Recipe</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <RecipeCombobox
            value={selectedRecipeId}
            onChange={handleSelect}
            onClear={handleClear}
          />
          {selectedRecipeId && (
            <div className="flex justify-end">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleClear}
              >
                <X className="w-4 h-4 mr-2" />
                Clear Recipe
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
