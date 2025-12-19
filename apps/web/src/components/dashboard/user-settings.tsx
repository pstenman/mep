"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Avatar,
  AvatarFallback,
  Button,
  useSidebar,
} from "@mep/ui";
import { LogOut, Settings } from "lucide-react";

export function UserMenu() {
  const { state } = useSidebar();

  if (state === "collapsed") {
    return (
      <Avatar>
        <AvatarFallback className="h-8 w-8">PS</AvatarFallback>
      </Avatar>
    );
  }

  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="user-menu">
        <AccordionTrigger chevronSize={4}>
          <Avatar>
            <AvatarFallback className="h-8 w-8">PS</AvatarFallback>
          </Avatar>
        </AccordionTrigger>
        <AccordionContent className="flex flex-col gap-2">
          <Button
            variant="ghost"
            className="flex items-center gap-2 text-xs w-full justify-start"
          >
            <Settings size={16} />
            {/* Todo fix settings page and route */}
            <span>Settings</span>
          </Button>
          <Button
            variant="ghost"
            className="flex items-center gap-2 text-xs w-full justify-start"
            onClick={() => console.log("Sign out")}
          >
            <LogOut size={16} />
            {/* todo fix sign-out and redirect */}
            <span>Logout</span>
          </Button>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
