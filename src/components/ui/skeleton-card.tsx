
import { Skeleton } from "./skeleton";

export function SkeletonCard() {
  return (
    <div className="space-y-3">
      <Skeleton className="h-[125px] w-full rounded-lg" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[80%]" />
        <Skeleton className="h-4 w-[60%]" />
      </div>
    </div>
  );
}
