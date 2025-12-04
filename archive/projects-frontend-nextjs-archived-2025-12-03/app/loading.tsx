/**
 * Root Loading State
 * Displayed while the root layout and page are loading
 */

import { Container } from "@/components/ui/container";
import { LoadingSkeleton } from "@/components/ui/loading-skeleton";

export default function Loading() {
  return (
    <Container className="py-12">
      <div className="space-y-8">
        {/* Header skeleton */}
        <div className="space-y-4">
          <LoadingSkeleton variant="text" height={40} width="50%" />
          <LoadingSkeleton variant="text" height={24} width="70%" />
        </div>

        {/* Content skeleton */}
        <div className="space-y-4">
          <LoadingSkeleton variant="rounded" height={400} />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <LoadingSkeleton variant="rounded" height={150} />
            <LoadingSkeleton variant="rounded" height={150} />
            <LoadingSkeleton variant="rounded" height={150} />
          </div>
        </div>
      </div>
    </Container>
  );
}
