import { Button, Popover, PopoverContent, PopoverTrigger } from "@mep/ui";

import { Globe } from "lucide-react";
import { LanguageSelect } from "../language-select";
import { ThemeSwitch } from "../theme-switch";

export function CornerSettings() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          className="fixed bottom-4 right-4 z-50 h-10 w-10 p-2 rounded-full shadow-lg"
          variant="secondary"
        >
          <Globe size={20} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="flex flex-col gap-2 w-40">
        <LanguageSelect />
        <ThemeSwitch />
      </PopoverContent>
    </Popover>
  );
}
