import type { GroupKey, GroupedSection } from "@/utils/nav-path/types";
import { PreparationsView } from "../preparations/view";
import type { PrepGroup } from "@/utils/nav-path/types";

interface GroupedViewProps {
  section: GroupedSection;
  group: GroupKey | "all";
}

export function GroupedView({ section, group }: GroupedViewProps) {
  switch (section) {
    case "preparations":
      return <PreparationsView group={group as PrepGroup} />;
    default:
      return <div>GroupedView</div>;
  }
}
