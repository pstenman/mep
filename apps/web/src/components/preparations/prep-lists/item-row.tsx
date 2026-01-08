import { PrepStatus, type PrepListItem, type Recipe } from "@mep/types";
import { Badge, Button, cn } from "@mep/ui";
import { BookText } from "lucide-react";
import { useTranslations } from "next-intl";

interface PrepItemRowProps {
  item: PrepListItem;
  onToggle?: (id: string) => void;
  onStatusToggle?: (id: string) => void;
  onRecipeClick?: (recipe: Recipe) => void;
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
    case PrepStatus.DONE:
      return "bg-green-500/10 text-green-700 border-green-500/30 dark:bg-green-500/20 dark:text-green-400 dark:border-green-500/40";
    default:
      return "";
  }
};

const getStatusNameBadgeClassName = (status?: PrepStatus): string => {
  switch (status) {
    case PrepStatus.MARK:
      return "bg-yellow-500/10 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400";
    case PrepStatus.PREP:
    case PrepStatus.PREP2:
      return "bg-orange-500/10 text-orange-700 dark:bg-orange-500/20 dark:text-orange-400";
    case PrepStatus.PRIORITY:
      return "bg-red-500/10 text-red-700 dark:bg-red-500/20 dark:text-red-400";
    case PrepStatus.DONE:
      return "bg-green-500/10 text-green-700 dark:bg-green-500/20 dark:text-green-400";
    default:
      return "bg-transparent";
  }
};

export function PrepItemRow({
  item,
  onToggle,
  onStatusToggle,
  onRecipeClick,
}: PrepItemRowProps) {
  const t = useTranslations("preparations");
  const handleBadgeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onStatusToggle?.(item.id);
  };

  const handleRecipeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (item.recipe && onRecipeClick) {
      onRecipeClick(item.recipe);
    }
  };

  return (
    <li
      onClick={() => onToggle?.(item.id)}
      className="flex items-center justify-between rounded-md cursor-pointer transition"
    >
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <Badge
          variant="secondary"
          className={cn(
            "text-sm sm:text-[15px] leading-tight truncate border-0",
            getStatusNameBadgeClassName(item.status),
          )}
        >
          {item.name}
        </Badge>
        {item.recipeId && item.recipe && (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleRecipeClick}
            className="shrink-0 text-muted-foreground hover:text-foreground transition-colors"
            title={t("prepList.itemRow.viewRecipe", { name: item.recipe.name })}
          >
            <BookText className="w-4 h-4" />
          </Button>
        )}
      </div>

      <Badge
        variant="outline"
        onClick={handleBadgeClick}
        className={cn(
          "cursor-pointer shrink-0",
          getStatusBadgeClassName(item.status),
        )}
      >
        {item.status ? t(`prepList.status.${item.status}`) : ""}
      </Badge>
    </li>
  );
}
