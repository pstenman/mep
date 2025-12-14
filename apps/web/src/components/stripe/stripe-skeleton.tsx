import { Skeleton } from "@mep/ui";

export function StripeSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <Skeleton className="h-10 bg-muted/50 rounded" />
      <Skeleton className="h-10 bg-muted/50 rounded" />
      <Skeleton className="h-10 bg-muted/50 rounded" />
    </div>
  );
}
