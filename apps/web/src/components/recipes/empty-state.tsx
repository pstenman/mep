"use client";

import { Text, Button } from "@mep/ui";
import { useRecipesSheet } from "./sheet";

export function EmptyState() {
  const { open } = useRecipesSheet();

  return (
    <div className="h-screen flex items-center justify-center flex-col space-y-6">
      <div className="flex items-center justify-center flex-col space-y-2 text-center">
        <Text className="text-2xl font-medium">No recipes yet</Text>
        <Text>Create your first recipe to get started</Text>
        <Button
          variant="outline"
          size="lg"
          className="hover:bg-primary/90 hover:text-primary-foreground hover:border-primary"
          onClick={() => open()}
        >
          Create Recipe
        </Button>
      </div>
    </div>
  );
}
