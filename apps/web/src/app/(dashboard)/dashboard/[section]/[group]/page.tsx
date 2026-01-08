import { GroupedView } from "@/components/shared/grouped-view";
import { GROUP_KEYS } from "@/lib/navigation/dashboard/types";
import { notFound } from "next/navigation";
import type {
  GroupedSection,
  GroupKey,
} from "@/lib/navigation/dashboard/types";

const GROUPED_SECTIONS = ["preparations", "menus", "allergies"] as const;

const ALLOWED_GROUPS_WITH_ALL = ["allergies"] as const;

export default async function SectionGroupPage({
  params,
}: {
  params: Promise<{ section: string; group: string }>;
}) {
  const { section, group } = await params;

  if (!GROUPED_SECTIONS.includes(section as GroupedSection)) {
    notFound();
  }

  const isValidGroup =
    GROUP_KEYS.includes(group as any) ||
    (group === "all" && ALLOWED_GROUPS_WITH_ALL.includes(section as any));

  if (!isValidGroup) {
    notFound();
  }

  return (
    <GroupedView
      section={section as GroupedSection}
      group={group as GroupKey | "all"}
    />
  );
}
