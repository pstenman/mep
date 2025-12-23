import { GroupedView } from "@/components/shared/grouped-view";
import { GROUP_KEYS } from "@/utils/nav-path/groups";
import { notFound } from "next/navigation";
import type { GroupedSection, GroupKey } from "@/utils/nav-path/types";

const GROUPED_SECTIONS = [
  "preparations",
  "menues",
  "orders",
  "allergies",
] as const;

const ALLOWED_GROUPS_WITH_ALL = ["allergies", "orders"] as const;

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
