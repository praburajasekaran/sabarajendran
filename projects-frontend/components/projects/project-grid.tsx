"use client";

import { Grid } from "@/components/ui/grid";
import { ProjectCard, ProjectCardProps } from "./project-card";
import { LoadingSpinner, LoadingSkeleton } from "@/components/ui/loading-spinner";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "@/lib/animations";

/**
 * ProjectGrid Component
 *
 * Grid layout for displaying project cards with loading and empty states.
 * Handles responsive layout and various display states.
 *
 * @example
 * ```tsx
 * <ProjectGrid projects={projects} />
 *
 * <ProjectGrid
 *   projects={filteredProjects}
 *   loading={isLoading}
 *   emptyMessage="No projects match your filters"
 *   onReset={clearFilters}
 * />
 * ```
 */

export interface ProjectGridProps {
  /** Array of projects to display */
  projects: ProjectCardProps[];
  /** Loading state */
  loading?: boolean;
  /** Error state */
  error?: string;
  /** Empty state message */
  emptyMessage?: string;
  /** Empty state action */
  onReset?: () => void;
  /** Grid columns configuration */
  cols?: 1 | 2 | 3 | 4 | "auto";
  /** Gap between items */
  gap?: "sm" | "md" | "lg" | "xl";
  /** Additional CSS classes */
  className?: string;
}

export function ProjectGrid({
  projects,
  loading = false,
  error,
  emptyMessage = "No projects found",
  onReset,
  cols = "auto",
  gap = "lg",
  className,
}: ProjectGridProps) {
  // Loading State
  if (loading) {
    return (
      <Grid cols={cols} gap={gap} className={className}>
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="space-y-4">
            <LoadingSkeleton className="aspect-[16/10] w-full" />
            <LoadingSkeleton variant="text" count={1} className="w-3/4" />
            <LoadingSkeleton variant="text" count={2} />
            <LoadingSkeleton variant="text" count={1} className="w-1/2" />
          </div>
        ))}
      </Grid>
    );
  }

  // Error State
  if (error) {
    return (
      <EmptyState
        variant="default"
        title="Failed to load projects"
        message={error}
        action={
          onReset && (
            <Button onClick={onReset} variant="primary">
              Try Again
            </Button>
          )
        }
      />
    );
  }

  // Empty State
  if (!projects || projects.length === 0) {
    return (
      <EmptyState
        variant="search"
        title={emptyMessage}
        message="Try adjusting your search or filter criteria"
        action={
          onReset && (
            <Button onClick={onReset} variant="outline">
              Clear Filters
            </Button>
          )
        }
      />
    );
  }

  // Projects Grid with stagger animation
  return (
    <motion.div
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      className={cn(
        "grid gap-6",
        cols === 1 && "grid-cols-1",
        cols === 2 && "grid-cols-1 md:grid-cols-2",
        cols === 3 && "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
        cols === 4 && "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
        cols === "auto" && "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
        className
      )}
    >
      {projects.map((project) => (
        <motion.div key={project.slug} variants={staggerItem}>
          <ProjectCard {...project} />
        </motion.div>
      ))}
    </motion.div>
  );
}
