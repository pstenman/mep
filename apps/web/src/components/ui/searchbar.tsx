import { Button, Input } from "@mep/ui";
import { Search, X } from "lucide-react";

interface SearchbarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function Searchbar({ value, onChange, placeholder }: SearchbarProps) {
  return (
    <div className="relative w-full max-w-md">
      <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground" />
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="pl-9 pr-9 rounded-xl"
      />

      {value && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-1/2 -translate-y-1/2"
          onClick={() => onChange("")}
        >
          <X className="size-4" />
        </Button>
      )}
    </div>
  );
}
