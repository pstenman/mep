import type {
  GroupKey,
  GroupedSection,
  PrepGroup,
} from "@/lib/navigation/dashboard/types";
import { PreparationTemplateView } from "../preparations/view";
import { MenusView } from "../menus/view";
import { AllergiesView } from "../allergies/view";

interface GroupedViewProps {
  section: GroupedSection;
  group: GroupKey | "all";
}

export function GroupedView({ section, group }: GroupedViewProps) {
  switch (section) {
    case "preparations":
      return <PreparationTemplateView group={group as PrepGroup} />;
    case "menus":
      return <MenusView group={group as GroupKey} />;
    case "allergies":
      return <AllergiesView group={group as GroupKey} />;
    default:
      return <div>GroupedView</div>;
  }
}
