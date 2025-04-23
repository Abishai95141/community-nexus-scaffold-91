
import { Skeleton } from "./skeleton";
import { SkeletonCard } from "./skeleton-card";

interface SkeletonPageProps {
  title?: boolean;
  cardCount?: number;
}

export function SkeletonPage({ title = true, cardCount = 4 }: SkeletonPageProps) {
  return (
    <div className="space-y-6">
      {title && (
        <div className="space-y-2">
          <Skeleton className="h-10 w-[250px]" />
          <Skeleton className="h-4 w-[400px]" />
        </div>
      )}

      <div className="space-y-4">
        <Skeleton className="h-8 w-[200px]" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: cardCount }).map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </div>
      </div>
    </div>
  );
}
