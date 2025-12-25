import { Popover, PopoverTrigger, Button, cn, PopoverContent } from "@mep/ui";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";

interface MenuItemActionsProps {
  onEdit: () => void;
  onDelete: () => void;
}

export function MenuItemActions({ onEdit, onDelete }: MenuItemActionsProps) {
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
