/**
 * Project Filtering Utilities
 *
 * Client-side filtering logic for projects with multi-criteria support.
 * Implements efficient AND logic for combining multiple filter conditions.
 *
 * WHY: 1000+ projects need instant filtering without server roundtrips.
 * All filtering happens on the client after initial data fetch for instant results.
 *
 * Performance: O(n) filtering with early exits for failed conditions.
 */

import type { Project } from "@/lib/wordpress/types";
import { mapStatusToCategory, type StatusCategory } from "./status-mapping";

/**
 * Filter criteria interface
 */
export interface FilterCriteria {
  /** Filter by category slugs (OR logic if multiple) */
  categories?: string[];
  /** Filter by village slugs (OR logic if multiple) */
  villages?: string[];
  /** Filter by year slugs (OR logic if multiple) */
  years?: string[];
  /** Filter by status slugs (OR logic if multiple) */
  statuses?: string[];
  /** Filter by scheme slugs (OR logic if multiple) */
  schemes?: string[];
  /** Search query (searches title, excerpt, content) */
  search?: string;
}

/**
 * Filter projects by multiple criteria
 *
 * Applies AND logic between different filter types (category AND village AND year)
 * Applies OR logic within same filter type (category1 OR category2)
 *
 * @param projects - Array of projects to filter
 * @param criteria - Filter criteria
 * @returns Filtered projects array
 *
 * @example
 * ```ts
 * const filtered = filterProjects(allProjects, {
 *   categories: ['infrastructure'],
 *   villages: ['nannikuppam-east', 'nannikuppam-west'],
 *   statuses: ['completed']
 * });
 * // Returns projects that are:
 * // - Infrastructure category AND
 * // - (Nannikuppam East OR Nannikuppam West) AND
 * // - Completed status
 * ```
 */
export function filterProjects(
  projects: Project[],
  criteria: FilterCriteria
): Project[] {
  return projects.filter((project) => {
    // Category filter (OR logic within categories)
    if (criteria.categories && criteria.categories.length > 0) {
      const hasMatchingCategory = project.categories.some((cat) =>
        criteria.categories!.includes(cat.slug)
      );
      if (!hasMatchingCategory) return false;
    }

    // Village filter (OR logic within villages)
    if (criteria.villages && criteria.villages.length > 0) {
      const hasMatchingVillage = project.villages.some((village) =>
        criteria.villages!.includes(village.slug)
      );
      if (!hasMatchingVillage) return false;
    }

    // Year filter (OR logic within years)
    if (criteria.years && criteria.years.length > 0) {
      const hasMatchingYear = project.years.some((year) =>
        criteria.years!.includes(year.slug)
      );
      if (!hasMatchingYear) return false;
    }

    // Status filter (OR logic within statuses)
    // Now uses simplified categories (completed, in-progress)
    if (criteria.statuses && criteria.statuses.length > 0) {
      const hasMatchingStatus = project.statuses.some((status) => {
        // Map the project's detailed status to a category
        const statusCategory = mapStatusToCategory(status.name);
        // Check if any selected filter category matches
        return criteria.statuses!.includes(statusCategory);
      });
      if (!hasMatchingStatus) return false;
    }

    // Scheme filter (OR logic within schemes)
    if (criteria.schemes && criteria.schemes.length > 0) {
      const hasMatchingScheme = project.schemes.some((scheme) =>
        criteria.schemes!.includes(scheme.slug)
      );
      if (!hasMatchingScheme) return false;
    }

    // Search filter (searches across title, excerpt, content)
    if (criteria.search && criteria.search.trim()) {
      const searchLower = criteria.search.toLowerCase().trim();
      const matchesSearch =
        project.title.toLowerCase().includes(searchLower) ||
        project.excerpt.toLowerCase().includes(searchLower) ||
        project.content.toLowerCase().includes(searchLower);
      if (!matchesSearch) return false;
    }

    // All conditions passed
    return true;
  });
}

/**
 * Get filter counts for each taxonomy term
 *
 * Useful for showing "Category (23)" in filter UI.
 * Counts how many projects match each term given current filters.
 *
 * @param projects - Projects to count
 * @param currentFilters - Currently active filters (to show counts with other filters applied)
 * @returns Object with counts for each taxonomy
 *
 * @example
 * ```ts
 * const counts = getFilterCounts(projects, { villages: ['nannikuppam-east'] });
 * // Returns counts for all taxonomies with village filter applied
 * // { categories: { infrastructure: 12, healthcare: 5 }, ... }
 * ```
 */
export function getFilterCounts(
  projects: Project[],
  currentFilters: FilterCriteria = {}
): {
  categories: Record<string, number>;
  villages: Record<string, number>;
  years: Record<string, number>;
  statuses: Record<string, number>;
  schemes: Record<string, number>;
} {
  const counts = {
    categories: {} as Record<string, number>,
    villages: {} as Record<string, number>,
    years: {} as Record<string, number>,
    statuses: {} as Record<string, number>,
    schemes: {} as Record<string, number>,
  };

  // Count occurrences in filtered projects
  projects.forEach((project) => {
    project.categories.forEach((cat) => {
      counts.categories[cat.slug] = (counts.categories[cat.slug] || 0) + 1;
    });
    project.villages.forEach((village) => {
      counts.villages[village.slug] = (counts.villages[village.slug] || 0) + 1;
    });
    project.years.forEach((year) => {
      counts.years[year.slug] = (counts.years[year.slug] || 0) + 1;
    });
    // Map detailed statuses to simplified categories for counting
    project.statuses.forEach((status) => {
      const category = mapStatusToCategory(status.name);
      counts.statuses[category] = (counts.statuses[category] || 0) + 1;
    });
    project.schemes.forEach((scheme) => {
      counts.schemes[scheme.slug] = (counts.schemes[scheme.slug] || 0) + 1;
    });
  });

  return counts;
}

/**
 * Sort projects by various criteria
 */
export type SortOption = "date-desc" | "date-asc" | "title-asc" | "title-desc" | "relevance";

/**
 * Sort filtered projects
 *
 * @param projects - Projects to sort
 * @param sortBy - Sort option
 * @param searchQuery - Search query (needed for relevance sorting)
 * @returns Sorted projects array
 */
export function sortProjects(
  projects: Project[],
  sortBy: SortOption = "date-desc",
  searchQuery?: string
): Project[] {
  const sorted = [...projects];

  switch (sortBy) {
    case "date-desc":
      return sorted.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );

    case "date-asc":
      return sorted.sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );

    case "title-asc":
      return sorted.sort((a, b) => a.title.localeCompare(b.title));

    case "title-desc":
      return sorted.sort((a, b) => b.title.localeCompare(a.title));

    case "relevance":
      if (!searchQuery) return sorted;
      // Sort by relevance score (title matches rank higher)
      return sorted.sort((a, b) => {
        const aScore = calculateRelevanceScore(a, searchQuery);
        const bScore = calculateRelevanceScore(b, searchQuery);
        return bScore - aScore;
      });

    default:
      return sorted;
  }
}

/**
 * Calculate relevance score for search ranking
 * Higher scores = better matches
 */
function calculateRelevanceScore(project: Project, query: string): number {
  const queryLower = query.toLowerCase();
  let score = 0;

  // Exact title match: +100
  if (project.title.toLowerCase() === queryLower) {
    score += 100;
  }

  // Title starts with query: +50
  if (project.title.toLowerCase().startsWith(queryLower)) {
    score += 50;
  }

  // Title contains query: +20
  if (project.title.toLowerCase().includes(queryLower)) {
    score += 20;
  }

  // Excerpt contains query: +10
  if (project.excerpt.toLowerCase().includes(queryLower)) {
    score += 10;
  }

  // Content contains query: +5
  if (project.content.toLowerCase().includes(queryLower)) {
    score += 5;
  }

  // Category name matches: +15
  if (project.categories.some(cat => cat.name.toLowerCase().includes(queryLower))) {
    score += 15;
  }

  // Village name matches: +15
  if (project.villages.some(v => v.name.toLowerCase().includes(queryLower))) {
    score += 15;
  }

  return score;
}

/**
 * Check if any filters are active
 */
export function hasActiveFilters(criteria: FilterCriteria): boolean {
  return !!(
    (criteria.categories && criteria.categories.length > 0) ||
    (criteria.villages && criteria.villages.length > 0) ||
    (criteria.years && criteria.years.length > 0) ||
    (criteria.statuses && criteria.statuses.length > 0) ||
    (criteria.schemes && criteria.schemes.length > 0) ||
    (criteria.search && criteria.search.trim())
  );
}

/**
 * Count total active filters
 */
export function countActiveFilters(criteria: FilterCriteria): number {
  let count = 0;

  if (criteria.categories && criteria.categories.length > 0) {
    count += criteria.categories.length;
  }
  if (criteria.villages && criteria.villages.length > 0) {
    count += criteria.villages.length;
  }
  if (criteria.years && criteria.years.length > 0) {
    count += criteria.years.length;
  }
  if (criteria.statuses && criteria.statuses.length > 0) {
    count += criteria.statuses.length;
  }
  if (criteria.schemes && criteria.schemes.length > 0) {
    count += criteria.schemes.length;
  }
  if (criteria.search && criteria.search.trim()) {
    count += 1;
  }

  return count;
}

/**
 * Get human-readable filter summary
 *
 * @example
 * "Infrastructure projects in Nannikuppam East (2023, Completed)"
 */
export function getFilterSummary(
  criteria: FilterCriteria,
  taxonomies: {
    categories: Array<{ slug: string; name: string }>;
    villages: Array<{ slug: string; name: string }>;
    years: Array<{ slug: string; name: string }>;
    statuses: Array<{ slug: string; name: string }>;
    schemes: Array<{ slug: string; name: string }>;
  }
): string | null {
  if (!hasActiveFilters(criteria)) return null;

  const parts: string[] = [];

  // Categories
  if (criteria.categories && criteria.categories.length > 0) {
    const names = criteria.categories
      .map((slug) => taxonomies.categories.find((c) => c.slug === slug)?.name)
      .filter(Boolean);
    if (names.length > 0) {
      parts.push(names.join(", "));
    }
  }

  // Villages
  if (criteria.villages && criteria.villages.length > 0) {
    const names = criteria.villages
      .map((slug) => taxonomies.villages.find((v) => v.slug === slug)?.name)
      .filter(Boolean);
    if (names.length > 0) {
      parts.push(`in ${names.join(", ")}`);
    }
  }

  // Years
  if (criteria.years && criteria.years.length > 0) {
    const names = criteria.years
      .map((slug) => taxonomies.years.find((y) => y.slug === slug)?.name)
      .filter(Boolean);
    if (names.length > 0) {
      parts.push(`(${names.join(", ")})`);
    }
  }

  // Statuses
  if (criteria.statuses && criteria.statuses.length > 0) {
    const names = criteria.statuses
      .map((slug) => taxonomies.statuses.find((s) => s.slug === slug)?.name)
      .filter(Boolean);
    if (names.length > 0) {
      parts.push(`- ${names.join(", ")}`);
    }
  }

  // Search
  if (criteria.search) {
    parts.push(`matching "${criteria.search}"`);
  }

  return parts.length > 0 ? parts.join(" ") : null;
}
