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

      <ul>
        {group.items.map((item) => (
          <PrepItemRow key={item.id} item={item} onToggle={onToggleItem} />
        ))}
      </ul>
    </div>
  );
}
