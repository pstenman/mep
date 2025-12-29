import type { PrepListGroup, Recipe } from "@mep/types";
import { PrepGroupColumn } from "./group-column";

interface PrepListGridProps {
  groups: PrepListGroup[];
  onToggleItem?: (itemId: string) => void;
  onStatusToggle?: (itemId: string) => void;
  onRecipeClick?: (recipe: Recipe) => void;
}

export function PrepListGrid({
  groups,
  onToggleItem,
  onStatusToggle,
  onRecipeClick,
}: PrepListGridProps) {
  return (
    <div className="mx-auto max-w-[1400px] px-3 sm:px-6 border border-border/20 rounded-lg p-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {groups.map((group) => (
          <PrepGroupColumn
            key={group.id}
            group={group}
            onToggleItem={onToggleItem}
            onStatusToggle={onStatusToggle}
            onRecipeClick={onRecipeClick}
          />
        ))}
      </div>
    </div>
  );
}
