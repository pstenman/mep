"use client";

import { dashboardPrefix } from "@/lib/navigation/paths";
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
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/auth/useAuth";

export function UserMenu() {
  const { state } = useSidebar();
  const { supabase } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Error signing out:", error);
        return;
      }
      router.push("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

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
            <Link
              href={dashboardPrefix("settings")}
              className="flex items-center gap-2"
            >
              <Settings size={16} />
              Settings
            </Link>
          </Button>
          <Button
            variant="ghost"
            className="flex items-center gap-2 text-xs w-full justify-start"
            onClick={handleSignOut}
          >
            <LogOut size={16} />
            <span>Logout</span>
          </Button>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
