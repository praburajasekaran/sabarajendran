/**
 * Projects Page Loading State
 * Skeleton that matches the actual projects page layout
 */

import { Container } from "@/components/ui/container";
import { LoadingSkeleton } from "@/components/ui/loading-skeleton";
import { ProjectGridSkeleton } from "@/components/projects/project-card-skeleton";

export default function ProjectsLoading() {
  return (
    <Container className="py-8 md:py-12">
      <div className="space-y-8">
        {/* Header skeleton */}
        <div className="space-y-4">
          <LoadingSkeleton variant="text" height={48} width="40%" />
          <LoadingSkeleton variant="text" height={24} width="60%" />
        </div>

        {/* Stats skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white p-6 rounded-lg border border-gray-200">
              <LoadingSkeleton variant="text" height={32} width="60%" />
              <LoadingSkeleton variant="text" className="mt-2" width="80%" />
            </div>
          ))}
        </div>

        {/* Filters skeleton */}
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex flex-col md:flex-row gap-4">
            <LoadingSkeleton variant="rounded" height={44} className="flex-1" />
            <LoadingSkeleton variant="rounded" height={44} width={120} />
            <LoadingSkeleton variant="rounded" height={44} width={120} />
          </div>
        </div>

        {/* Project grid skeleton */}
        <ProjectGridSkeleton count={6} />
      </div>
    </Container>
  );
}
