"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { trpc } from "@/lib/trpc/client";
import { PrepType } from "@mep/types";
import type { PrepGroup } from "@/lib/navigation/dashboard/types";

interface PrepList {
  id: string;
  name: string;
  prepTypes: PrepType;
  scheduleFor: Date | null;
  prepGroups?: PrepGroup[];
}

function prepTypeToGroup(prepType: PrepType): string {
  const mapping: Record<PrepType, string> = {
    [PrepType.BREAKFAST]: "breakfast",
    [PrepType.LUNCH]: "lunch",
    [PrepType.ALACARTE]: "al-a-carte",
    [PrepType.SET]: "set",
    [PrepType.GROUP]: "group",
    [PrepType.MAIN]: "main",
  };
  return mapping[prepType] || "breakfast";
}

export default function DashboardPage() {
  const router = useRouter();
  const { data: allLists } = trpc.preparations.prepLists.getAll.useQuery({});

  useEffect(() => {
    if (!allLists?.data?.items) return;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const activeLists = allLists.data.items.filter((list: PrepList) => {
      if (!list.scheduleFor) return false;
      const scheduleDate = new Date(list.scheduleFor);
      scheduleDate.setHours(0, 0, 0, 0);
      return scheduleDate.getTime() <= today.getTime();
    });

    if (activeLists.length === 0) {
      router.replace("/dashboard/preparations/breakfast");
      return;
    }

    const sortedActiveLists = [...activeLists].sort((a, b) => {
      const dateA = a.scheduleFor ? new Date(a.scheduleFor).getTime() : 0;
      const dateB = b.scheduleFor ? new Date(b.scheduleFor).getTime() : 0;
      return dateB - dateA;
    });

    const mostRecentList = sortedActiveLists[0];
    if (mostRecentList?.prepTypes) {
      const group = prepTypeToGroup(mostRecentList.prepTypes as PrepType);
      router.replace(`/dashboard/preparations/${group}`);
    } else {
      router.replace("/dashboard/preparations/breakfast");
    }
  }, [allLists, router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-muted-foreground">Redirecting...</p>
    </div>
  );
}
