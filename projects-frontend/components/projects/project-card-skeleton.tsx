/**
 * Project Card Skeleton
 * Loading skeleton that matches the actual ProjectCard component layout
 * Provides visual continuity during loading states
 */

"use client";

import { LoadingSkeleton } from "@/components/ui/loading-skeleton";
import { Card } from "@/components/ui/card";

export function ProjectCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      {/* Image skeleton */}
      <LoadingSkeleton
        variant="rectangular"
        height={240}
        className="w-full"
      />

      <div className="p-6 space-y-4">
        {/* Category and status badges */}
        <div className="flex items-center gap-2">
          <LoadingSkeleton variant="rounded" width={80} height={24} />
          <LoadingSkeleton variant="rounded" width={90} height={24} />
        </div>

        {/* Title */}
        <LoadingSkeleton variant="text" height={28} width="85%" />

        {/* Description */}
        <div className="space-y-2">
          <LoadingSkeleton variant="text" />
          <LoadingSkeleton variant="text" />
          <LoadingSkeleton variant="text" width="70%" />
        </div>

        {/* Metadata (village, year) */}
        <div className="flex items-center gap-4 pt-2">
          <div className="flex items-center gap-2">
            <LoadingSkeleton variant="circular" width={16} height={16} />
            <LoadingSkeleton variant="text" width={80} />
          </div>
          <div className="flex items-center gap-2">
            <LoadingSkeleton variant="circular" width={16} height={16} />
            <LoadingSkeleton variant="text" width={50} />
          </div>
        </div>
      </div>
    </Card>
  );
}

/**
 * Project Grid Skeleton
 * Shows multiple project card skeletons in a grid layout
 */
export function ProjectGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ProjectCardSkeleton key={i} />
      ))}
    </div>
  );
}
