import type { PrepStatus } from "@mep/types";

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
        px-2
        rounded-md
        cursor-pointer
        active:bg-muted/70
        sm:hover:bg-muted/50
        transition
      "
    >
      <span className="text-sm sm:text-[15px] leading-tight">{item.name}</span>

      <span
        className="
          h-3 w-3
          rounded-full
          border
          border-muted-foreground/40
          shrink-0
        "
      />
    </li>
  );
}
