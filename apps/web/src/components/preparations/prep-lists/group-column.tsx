import type { PrepListGroup, Recipe } from "@mep/types";
import { PrepItemRow } from "./item-row";

interface PrepGroupColumnProps {
  group: PrepListGroup;
  onToggleItem?: (itemId: string) => void;
  onStatusToggle?: (itemId: string) => void;
  onRecipeClick?: (recipe: Recipe) => void;
}

export function PrepGroupColumn({
  group,
  onToggleItem,
  onStatusToggle,
  onRecipeClick,
}: PrepGroupColumnProps) {
  return (
    <div
      className="
        rounded-lg bg-background
      "
    >
      <h3
        className="
          text-xs
          font-semibold
          tracking-wide
          uppercase
          text-muted-foreground
          
        "
      >
        {group.name}
      </h3>

      <ul className="space-y-0.5">
        {group.items.map((item) => (
          <PrepItemRow
            key={item.id}
            item={item}
            onToggle={onToggleItem}
            onStatusToggle={onStatusToggle}
            onRecipeClick={onRecipeClick}
          />
        ))}
      </ul>
    </div>
  );
}
