import type { GroupKey, GroupedSection } from "@/utils/nav-path/types";

interface GroupedViewProps {
  section: GroupedSection;
  group: GroupKey | "all";
}

export function GroupedView({ section, group }: GroupedViewProps) {
  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold capitalize">
        {section} {group}
      </h2>
    </section>
  );
}
