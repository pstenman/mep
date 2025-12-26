import type { PrepStatus } from "@mep/types";
import { Badge } from "@mep/ui";

interface PrepItemRowProps {
  item: {
    id: string;
    name: string;
    status?: PrepStatus;
  };
  onToggle?: (id: string) => void;
}

export function PrepItemRow({ item, onToggle }: PrepItemRowProps) {
  return (
    <li
      onClick={() => onToggle?.(item.id)}
      className="
        flex items-center justify-between
        min-h-[44px]
        rounded-md
        cursor-pointer
        active:bg-muted/70
        sm:hover:bg-muted/50
        transition
      "
    >
      <span className="text-sm sm:text-[15px] leading-tight">{item.name}</span>

      <Badge variant="outline">{item.status}</Badge>
    </li>
  );
}
