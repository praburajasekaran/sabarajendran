"use client";

/**
 * Projects List Component
 *
 * Animated grid of project cards with smooth transitions.
 * Handles loading states, empty states, and result animations.
 */

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { MapPin, Calendar, CheckCircle, Search, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Project } from "@/lib/wordpress/types";
import { mapStatusToCategory } from "@/lib/utils/status-mapping";

export interface ProjectsListProps {
  /** Projects to display */
  projects: Project[];
  /** Loading state */
  isLoading?: boolean;
  /** Search query for highlighting */
  searchQuery?: string;
  /** Additional CSS classes */
  className?: string;
}

export function ProjectsList({
  projects,
  isLoading = false,
  searchQuery,
  className,
}: ProjectsListProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Loading skeleton
  if (isLoading) {
    return (
      <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", className)}>
        {Array.from({ length: 6 }).map((_, i) => (
          <ProjectCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  // Empty state
  if (projects.length === 0) {
    return (
      <div className={cn("py-20", className)}>
        <div className="text-center max-w-md mx-auto">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 text-gray-400 rounded-full mb-6">
            <Search className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            No projects found
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Try adjusting your filters or search query to find what you're looking for.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", className)}>
      {projects.map((project, index) => (
        <ProjectCard
          key={project.id}
          project={project}
          index={index}
          mounted={mounted}
          searchQuery={searchQuery}
        />
      ))}
    </div>
  );
}

/**
 * Individual Project Card with animation
 */
interface ProjectCardProps {
  project: Project;
  index: number;
  mounted: boolean;
  searchQuery?: string;
}

function ProjectCard({ project, index, mounted, searchQuery }: ProjectCardProps) {
  return (
    <article
      className={cn(
        "bg-white rounded-lg shadow-md overflow-hidden",
        "hover:shadow-xl hover:-translate-y-1",
        "transition-all duration-300",
        "transform",
        mounted ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
      )}
      style={{
        transitionDelay: `${index * 50}ms`,
      }}
    >
      <Link href={`/projects/${project.slug}`} className="block group">
        {/* Featured Image */}
        {project.featuredImage ? (
          <div className="relative w-full h-48 bg-gray-200 overflow-hidden">
            <Image
              src={project.featuredImage.url}
              alt={project.featuredImage.alt || project.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        ) : (
          <div className="w-full h-48 bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
            <MapPin className="w-12 h-12 text-primary-400" />
          </div>
        )}

        {/* Card Content */}
        <div className="p-6">
          {/* Title */}
          <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-primary-600 transition-colors">
            {project.title}
          </h3>

          {/* Metadata */}
          <div className="space-y-2 mb-4 text-sm text-gray-600">
            {project.villages[0] && (
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary-500 flex-shrink-0" />
                <span>{project.villages[0].name}</span>
              </div>
            )}
            {project.years[0] && (
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary-500 flex-shrink-0" />
                <span>{project.years[0].name}</span>
              </div>
            )}
            {project.statuses[0] && (
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                <span>{project.statuses[0].name}</span>
              </div>
            )}
          </div>

          {/* Excerpt */}
          <p className="text-gray-600 mb-4 line-clamp-3">
            {project.excerpt}
          </p>

          {/* Categories */}
          {project.categories.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {project.categories.slice(0, 2).map((cat) => (
                <span
                  key={cat.id}
                  className="inline-block px-3 py-1 bg-primary-50 text-primary-700 text-xs font-medium rounded-full"
                >
                  {cat.name}
                </span>
              ))}
              {project.categories.length > 2 && (
                <span className="inline-block px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                  +{project.categories.length - 2} more
                </span>
              )}
            </div>
          )}

          {/* Read More Link */}
          <div className="inline-flex items-center gap-2 text-primary-600 font-semibold group-hover:gap-3 transition-all">
            <span>View Details</span>
            <ArrowLeft className="w-4 h-4 rotate-180" />
          </div>
        </div>
      </Link>
    </article>
  );
}

/**
 * Loading skeleton for project card
 */
function ProjectCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
      {/* Image skeleton */}
      <div className="w-full h-48 bg-gray-200" />

      {/* Content skeleton */}
      <div className="p-6 space-y-4">
        {/* Title */}
        <div className="h-6 bg-gray-200 rounded w-3/4" />

        {/* Metadata */}
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-1/2" />
          <div className="h-4 bg-gray-200 rounded w-2/3" />
          <div className="h-4 bg-gray-200 rounded w-1/3" />
        </div>

        {/* Excerpt */}
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-full" />
          <div className="h-4 bg-gray-200 rounded w-5/6" />
          <div className="h-4 bg-gray-200 rounded w-4/6" />
        </div>

        {/* Tags */}
        <div className="flex gap-2">
          <div className="h-6 bg-gray-200 rounded-full w-20" />
          <div className="h-6 bg-gray-200 rounded-full w-24" />
        </div>
      </div>
    </div>
  );
}

/**
 * Results count display
 */
export interface ResultsCountProps {
  total: number;
  showing: number;
  searchQuery?: string;
  className?: string;
}

export function ResultsCount({ total, showing, searchQuery, className }: ResultsCountProps) {
  return (
    <div className={cn("text-gray-600", className)}>
      {searchQuery ? (
        <p>
          Found <span className="font-semibold text-gray-900">{total}</span> {total === 1 ? "project" : "projects"} matching{" "}
          <span className="font-semibold text-gray-900">"{searchQuery}"</span>
        </p>
      ) : (
        <p>
          Showing <span className="font-semibold text-gray-900">{showing}</span> of{" "}
          <span className="font-semibold text-gray-900">{total}</span> {total === 1 ? "project" : "projects"}
        </p>
      )}
    </div>
  );
}
