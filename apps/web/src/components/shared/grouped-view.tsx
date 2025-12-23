import type { GroupKey, GroupedSection } from "@/utils/nav-path/types";
import { PreparationsView } from "../preparations/view";
import type { PrepGroup } from "@/utils/nav-path/types";
import { MenusView } from "../menus/view";

interface GroupedViewProps {
  section: GroupedSection;
  group: GroupKey | "all";
}

export function GroupedView({ section, group }: GroupedViewProps) {
  switch (section) {
    case "preparations":
      return <PreparationsView group={group as PrepGroup} />;
    case "menus":
      return <MenusView group={group as GroupKey} />;
    default:
      return <div>GroupedView</div>;
  }
}
