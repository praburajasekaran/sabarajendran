/**
 * WordPress API Caching Configuration
 *
 * Defines caching strategies and revalidation rules for WordPress data.
 * Uses Next.js App Router caching features for optimal performance.
 *
 * WHY: Political constituent sites serve many visitors during peak times
 * (announcements, election seasons). Aggressive caching reduces server load
 * and provides instant page loads while maintaining data freshness.
 *
 * CACHING STRATEGY:
 * - Projects listings: 60s (frequently viewed, moderate update frequency)
 * - Individual projects: 5min (less traffic, infrequent updates)
 * - Taxonomy terms: 10min (rarely change)
 * - Statistics: 5min (can be slightly stale)
 * - Media: 1hr (images almost never change)
 */

import { unstable_cache } from "next/cache";
import type { CacheTag } from "./types";

// ============================================================================
// Cache Duration Constants
// ============================================================================

/**
 * Revalidation periods in seconds
 */
export const REVALIDATE = {
  /** Projects listing - revalidate every minute */
  PROJECTS: 60,

  /** Individual project - revalidate every 5 minutes */
  PROJECT: 300,

  /** Taxonomy terms - revalidate every 10 minutes */
  TAXONOMIES: 600,

  /** Statistics/counts - revalidate every 5 minutes */
  STATS: 300,

  /** Media/images - revalidate every hour */
  MEDIA: 3600,

  /** Never revalidate (use for truly static data) */
  NEVER: false as const,
} as const;

// ============================================================================
// Cache Tag Helpers
// ============================================================================

/**
 * Generate cache tag for a specific project
 *
 * @param slug - Project slug
 * @returns Cache tag string
 */
export function projectTag(slug: string): CacheTag {
  return `project-${slug}`;
}

/**
 * Get all cache tags for project-related data
 *
 * WHY: When a project is updated, we want to revalidate:
 * - The projects listing
 * - The specific project page
 *
 * @param slug - Optional project slug for specific invalidation
 * @returns Array of cache tags
 */
export function getProjectCacheTags(slug?: string): CacheTag[] {
  const tags: CacheTag[] = ["projects"];
  if (slug) {
    tags.push(projectTag(slug));
  }
  return tags;
}

// ============================================================================
// Cached API Wrappers
// ============================================================================

/**
 * Create a cached version of an API function
 *
 * Wraps any async function with Next.js unstable_cache for automatic
 * caching and revalidation.
 *
 * @param fn - Async function to cache
 * @param keyPrefix - Cache key prefix
 * @param revalidate - Revalidation period in seconds
 * @param tags - Cache tags for on-demand revalidation
 * @returns Cached function with same signature
 *
 * @example
 * ```ts
 * const cachedGetProjects = createCachedFunction(
 *   getProjects,
 *   'projects',
 *   REVALIDATE.PROJECTS,
 *   ['projects']
 * );
 * ```
 */
export function createCachedFunction<Args extends unknown[], Result>(
  fn: (...args: Args) => Promise<Result>,
  keyPrefix: string,
  revalidate: number | false,
  tags?: CacheTag[]
) {
  return unstable_cache(
    fn,
    [keyPrefix],
    {
      revalidate,
      tags,
    }
  );
}

// ============================================================================
// On-Demand Revalidation
// ============================================================================

/**
 * Revalidate projects cache
 *
 * Call this when projects are created/updated/deleted in WordPress.
 * Can be triggered via webhook or API route.
 *
 * WHY: ISR with time-based revalidation means updates can take up to
 * 60 seconds to appear. On-demand revalidation lets us update immediately
 * when we know content has changed (e.g., via WordPress webhook).
 *
 * @example
 * ```ts
 * // In an API route that receives WordPress webhook
 * export async function POST(request: Request) {
 *   const { project_slug } = await request.json();
 *   await revalidateProjects(project_slug);
 *   return Response.json({ revalidated: true });
 * }
 * ```
 */
export async function revalidateProjects(slug?: string) {
  const { revalidateTag } = await import("next/cache");

  await revalidateTag("projects", "max");

  if (slug) {
    await revalidateTag(projectTag(slug), "max");
  }
}

/**
 * Revalidate all taxonomies cache
 */
export async function revalidateTaxonomies() {
  const { revalidateTag } = await import("next/cache");
  await revalidateTag("taxonomies", "max");
}

/**
 * Revalidate specific taxonomy
 *
 * @param taxonomy - Taxonomy name
 */
export async function revalidateTaxonomy(taxonomy: string) {
  const { revalidateTag } = await import("next/cache");
  await revalidateTag(taxonomy, "max");
}

// ============================================================================
// Cache Key Generation
// ============================================================================

/**
 * Generate consistent cache key for filtered queries
 *
 * WHY: Same filters should hit same cache entry.
 * We need deterministic key generation from filter objects.
 *
 * @param filters - Filter object
 * @returns Stable cache key string
 */
export function generateFilterCacheKey(filters: Record<string, unknown>): string {
  // Sort keys to ensure consistent ordering
  const sortedKeys = Object.keys(filters).sort();
  const parts = sortedKeys.map(key => `${key}:${filters[key]}`);
  return parts.join("|");
}

// ============================================================================
// Cache Statistics (Development Helper)
// ============================================================================

/**
 * Log cache statistics to console (development only)
 *
 * Helps debug caching behavior and measure hit rates.
 *
 * @param key - Cache key
 * @param hit - Whether cache was hit
 */
export function logCacheStats(key: string, hit: boolean) {
  if (process.env.NODE_ENV === "development") {
    console.log(
      `[Cache ${hit ? "HIT" : "MISS"}] ${key} at ${new Date().toISOString()}`
    );
  }
}

// ============================================================================
// Cache Warming
// ============================================================================

/**
 * Warm cache for common queries
 *
 * Pre-populate cache with frequently accessed data during build.
 * This ensures first visitors get instant page loads.
 *
 * WHY: The first visitor after deploy would experience slow load
 * while cache populates. Cache warming eliminates this cold-start penalty.
 *
 * Call this in a build script or during static generation.
 */
export async function warmCache() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Cache warming skipped (not production)");
    return;
  }

  console.log("Warming WordPress API cache...");

  try {
    const { getProjects, getAllTaxonomies, getProjectsCount } = await import("./api");

    // Warm most common queries
    await Promise.all([
      getProjects({ page: 1, perPage: 12 }), // First page
      getAllTaxonomies(), // All filter options
      getProjectsCount(), // Total count
    ]);

    console.log("Cache warming completed successfully");
  } catch (error) {
    console.error("Cache warming failed:", error);
    // Don't throw - cache warming is best-effort
  }
}

// ============================================================================
// Cache Purge (Utility)
// ============================================================================

/**
 * Purge all WordPress-related cache
 *
 * Nuclear option for cache issues. Use sparingly.
 *
 * @example
 * ```ts
 * // In admin API route
 * export async function POST() {
 *   await purgeAllCache();
 *   return Response.json({ purged: true });
 * }
 * ```
 */
export async function purgeAllCache() {
  const { revalidateTag } = await import("next/cache");

  // Revalidate all known tags
  const tags: CacheTag[] = ["projects", "project", "taxonomies"];

  for (const tag of tags) {
    await revalidateTag(tag, "max");
  }

  console.log("All WordPress cache purged");
}
