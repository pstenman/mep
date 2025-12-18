import { Skeleton } from "@mep/ui";

export function PlanSkeleton() {
  return (
    <div className="bg-card p-6 rounded-lg space-y-4 animate-pulse">
      <Skeleton className="h-6 w-40 bg-muted/50 rounded" />
      <Skeleton className="h-4 w-32 bg-muted/50 rounded" />
      <Skeleton className="h-8 w-24 bg-muted/50 rounded mt-4" />
      <div className="space-y-2">
        <Skeleton className="h-3 w-full bg-muted/50 rounded" />
        <Skeleton className="h-3 w-3/4 bg-muted/50 rounded" />
        <Skeleton className="h-3 w-2/3 bg-muted/50 rounded" />
      </div>
    </div>
  );
}
