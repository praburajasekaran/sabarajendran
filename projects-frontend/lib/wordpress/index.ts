/**
 * WordPress API Integration - Barrel Export
 *
 * Clean public API for WordPress data fetching and transformation.
 * Import everything you need from a single entry point.
 *
 * @example
 * ```ts
 * import { getProjects, transformProject, REVALIDATE } from '@/lib/wordpress';
 * ```
 */

// ============================================================================
// Type Exports
// ============================================================================

export type {
  // Core WordPress types
  WPProject,
  WPTerm,
  WPMedia,
  WPRendered,
  WPLinks,
  WPMediaDetails,

  // Transformed types
  Project,
  SimpleTerm,
  FeaturedImage,

  // API types
  WPAPIResponse,
  WPAPIError,
  APIResult,
  ProjectFilters,
  TaxonomyType,
  TaxonomyCollection,

  // Cache types
  CacheTag,
  RevalidationConfig,
} from "./types";

// ============================================================================
// API Function Exports
// ============================================================================

export {
  // Projects
  getProjects,
  getAllProjects,
  getProject,
  getProjectById,

  // Taxonomies
  getTaxonomyTerms,
  getTaxonomyTerm,
  getAllTaxonomies,

  // Media
  getMedia,

  // Statistics
  getProjectsCount,
  getProjectsCountByTerm,
} from "./api";

// ============================================================================
// Transformation Function Exports
// ============================================================================

export {
  // Project transformation
  transformProject,
  transformProjects,

  // HTML utilities
  stripWrapperTags,
  sanitizeContent,
  htmlToPlainText,
  truncateHtml,

  // Media utilities
  extractFeaturedImage,

  // Taxonomy utilities
  transformTerm,

  // URL utilities
  extractSlugFromLink,
  convertToNextRoute,

  // Metadata generation
  generateProjectMetadata,
} from "./transform";

// ============================================================================
// Cache Exports
// ============================================================================

export {
  // Cache constants
  REVALIDATE,

  // Cache helpers
  projectTag,
  getProjectCacheTags,
  generateFilterCacheKey,

  // Cache functions
  createCachedFunction,
  revalidateProjects,
  revalidateTaxonomies,
  revalidateTaxonomy,
  warmCache,
  purgeAllCache,

  // Development
  logCacheStats,
} from "./cache";
