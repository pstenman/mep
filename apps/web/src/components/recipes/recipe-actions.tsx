import { Popover, PopoverTrigger, Button, PopoverContent } from "@mep/ui";
import { MoreHorizontal, Pencil, Trash2, Eye } from "lucide-react";

interface RecipeActionsProps {
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function RecipeActions({
  onView,
  onEdit,
  onDelete,
}: RecipeActionsProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground"
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </PopoverTrigger>

      <PopoverContent align="end" className="w-40 p-1">
        <Button
          variant="ghost"
          className="w-full justify-start"
          onClick={onView}
        >
          <Eye className="mr-2 h-4 w-4" />
          View
        </Button>

        <Button
          variant="ghost"
          className="w-full justify-start"
          onClick={onEdit}
        >
          <Pencil className="mr-2 h-4 w-4" />
          Edit
        </Button>

        <Button
          variant="ghost"
          className="w-full justify-start text-destructive"
          onClick={onDelete}
        >
          <Trash2 className="mr-2 h-4 w-4 text-destructive" />
          Delete
        </Button>
      </PopoverContent>
    </Popover>
  );
}
