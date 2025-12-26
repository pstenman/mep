import type { PrepStatus } from "@mep/types";
import { PrepItemRow } from "./item-row";

interface PrepGroupColumnProps {
  group: {
    id: string;
    name: string;
    items: {
      id: string;
      name: string;
      status?: PrepStatus;
    }[];
  };
  onToggleItem?: (itemId: string) => void;
}

export function PrepGroupColumn({ group, onToggleItem }: PrepGroupColumnProps) {
  return (
    <div
      className="
        border border-border/60
        rounded-lg
        p-3 sm:p-4
        bg-background
      "
    >
      <h3
        className="
          text-xs
          font-semibold
          tracking-wide
          uppercase
          text-muted-foreground
          mb-2 sm:mb-3
        "
      >
        {group.name}
      </h3>

      <ul className="space-y-1.5 sm:space-y-2">
        {group.items.map((item) => (
          <PrepItemRow key={item.id} item={item} onToggle={onToggleItem} />
        ))}
      </ul>
    </div>
  );
}
