import { Button } from "@mep/ui";

export default function RecipesPage() {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Recipes</h1>
        <Button className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90">
          Create Recipe
        </Button>
      </div>
    </div>
  );
}
