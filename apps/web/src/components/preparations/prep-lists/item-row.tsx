import { PrepStatus } from "@mep/types";
import { Badge, cn } from "@mep/ui";

interface PrepItemRowProps {
  item: {
    id: string;
    name: string;
    status?: PrepStatus;
  };
  onToggle?: (id: string) => void;
  onStatusToggle?: (id: string) => void;
}

const getStatusBadgeClassName = (status?: PrepStatus): string => {
  switch (status) {
    case PrepStatus.MARK:
      return "bg-yellow-500/10 text-yellow-700 border-yellow-500/30 dark:bg-yellow-500/20 dark:text-yellow-400 dark:border-yellow-500/40";
    case PrepStatus.PREP:
    case PrepStatus.PREP2:
      return "bg-orange-500/10 text-orange-700 border-orange-500/30 dark:bg-orange-500/20 dark:text-orange-400 dark:border-orange-500/40";
    case PrepStatus.PRIORITY:
      return "bg-red-500/10 text-red-700 border-red-500/30 dark:bg-red-500/20 dark:text-red-400 dark:border-red-500/40";
    default:
      return "";
  }
};

export function PrepItemRow({
  item,
  onToggle,
  onStatusToggle,
}: PrepItemRowProps) {
  const handleBadgeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onStatusToggle?.(item.id);
  };

  return (
    <li
      onClick={() => onToggle?.(item.id)}
      className="
        flex items-center justify-between
        rounded-md
        cursor-pointer
        active:bg-muted/70
        sm:hover:bg-muted/50
        transition
      "
    >
      <span className="text-sm sm:text-[15px] leading-tight">{item.name}</span>

      <Badge
        variant="outline"
        onClick={handleBadgeClick}
        className={cn("cursor-pointer", getStatusBadgeClassName(item.status))}
      >
        {item.status}
      </Badge>
    </li>
  );
}
