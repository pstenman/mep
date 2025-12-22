"use client";

import { Plus } from "lucide-react";
import { useUserSheet } from "../users/sheet";
import { usePathname } from "next/navigation";
import { createRoutes } from "@/lib/routes/create-routes";
import { DynamicButton } from "./dynamic-button";

export function CreateButton() {
  const { open: openUserSheet } = useUserSheet();
  const pathname = usePathname();
  const route = createRoutes.find((r) => r.match(pathname));
  const handleCreate = () => {
    if (!route) return;
    console.log("CreateButton -> handleCreate");
    openUserSheet();
  };

  if (!route) return null;

  return (
    <DynamicButton
      icon={Plus}
      tooltip={route.label}
      variant="default"
      className="rounded-full w-[40px] h-[40px]"
      size="icon"
      onClick={handleCreate}
    />
  );
}
