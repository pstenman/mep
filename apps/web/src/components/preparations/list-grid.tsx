import { PrepGroupColumn } from "./group-column";

interface PrepListGridProps {
  groups: {
    id: string;
    name: string;
    items: any[];
  }[];
  onToggleItem?: (itemId: string) => void;
}

export function PrepListGrid({ groups, onToggleItem }: PrepListGridProps) {
  return (
    <div className="mx-auto max-w-[1100px] px-3 sm:px-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
        {groups.map((group) => (
          <PrepGroupColumn
            key={group.id}
            group={group}
            onToggleItem={onToggleItem}
          />
        ))}
      </div>
    </div>
  );
}
