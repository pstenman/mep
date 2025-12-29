import { PrepGroupColumn } from "./group-column";

interface PrepListGridProps {
  groups: {
    id: string;
    name: string;
    items: any[];
  }[];
  onToggleItem?: (itemId: string) => void;
  onStatusToggle?: (itemId: string) => void;
}

export function PrepListGrid({
  groups,
  onToggleItem,
  onStatusToggle,
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
          />
        ))}
      </div>
    </div>
  );
}
