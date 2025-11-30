/**
 * WordPress REST API Type Definitions
 *
 * Complete TypeScript interfaces for WordPress REST API responses
 * from the Saba Projects headless CMS backend.
 *
 * @see http://localhost:8118/sabarajendran/wp-json/wp/v2/
 */

// ============================================================================
// Base WordPress Types
// ============================================================================

/**
 * WordPress rendered content wrapper
 * Contains HTML content and protection status
 */
export interface WPRendered {
  rendered: string;
  protected?: boolean;
}

/**
 * WordPress hypermedia link
 * Part of the HATEOAS (Hypermedia as the Engine of Application State) pattern
 */
export interface WPLink {
  href: string;
  embeddable?: boolean;
  taxonomy?: string;
  targetHints?: {
    allow: string[];
  };
}

/**
 * WordPress _links collection
 * Provides hypermedia navigation throughout the API
 */
export interface WPLinks {
  self: WPLink[];
  collection: WPLink[];
  about: WPLink[];
  "wp:attachment"?: WPLink[];
  "wp:term"?: WPLink[];
  "wp:featuredmedia"?: WPLink[];
  curies?: Array<{
    name: string;
    href: string;
    templated: boolean;
  }>;
}

// ============================================================================
// Taxonomy Term Types
// ============================================================================

/**
 * WordPress taxonomy term
 * Represents categories, tags, and custom taxonomies
 */
export interface WPTerm {
  id: number;
  count: number;
  description: string;
  link: string;
  name: string;
  slug: string;
  taxonomy: string;
  parent: number;
  meta: unknown[];
  _links: WPLinks;
}

/**
 * Simplified term structure for frontend use
 */
export interface SimpleTerm {
  id: number;
  name: string;
  slug: string;
}

// ============================================================================
// Media/Image Types
// ============================================================================

/**
 * WordPress media size variant
 */
export interface WPMediaSize {
  file: string;
  width: number;
  height: number;
  mime_type: string;
  source_url: string;
}

/**
 * WordPress media metadata
 */
export interface WPMediaDetails {
  width: number;
  height: number;
  file: string;
  filesize?: number;
  sizes?: {
    thumbnail?: WPMediaSize;
    medium?: WPMediaSize;
    large?: WPMediaSize;
    full?: WPMediaSize;
    [key: string]: WPMediaSize | undefined;
  };
  image_meta?: {
    aperture: string;
    credit: string;
    camera: string;
    caption: string;
    created_timestamp: string;
    copyright: string;
    focal_length: string;
    iso: string;
    shutter_speed: string;
    title: string;
    orientation: string;
    keywords: string[];
  };
}

/**
 * WordPress media/attachment object
 */
export interface WPMedia {
  id: number;
  date: string;
  date_gmt: string;
  guid: WPRendered;
  modified: string;
  modified_gmt: string;
  slug: string;
  status: string;
  type: string;
  link: string;
  title: WPRendered;
  author: number;
  comment_status: string;
  ping_status: string;
  template: string;
  meta: unknown[];
  description: WPRendered;
  caption: WPRendered;
  alt_text: string;
  media_type: string;
  mime_type: string;
  media_details: WPMediaDetails;
  source_url: string;
  _links: WPLinks;
}

/**
 * Simplified featured image structure for frontend use
 */
export interface FeaturedImage {
  id: number;
  url: string;
  alt: string;
  width: number;
  height: number;
  caption?: string;
  sizes?: {
    thumbnail?: string;
    medium?: string;
    large?: string;
  };
}

// ============================================================================
// Project Post Type
// ============================================================================

/**
 * WordPress Project custom post type (raw API response)
 *
 * This is the structure returned directly from the WordPress REST API.
 * Use the `transformProject()` function to convert to the clean Project type.
 */
export interface WPProject {
  id: number;
  date: string;
  date_gmt: string;
  guid: WPRendered;
  modified: string;
  modified_gmt: string;
  slug: string;
  status: "publish" | "draft" | "pending" | "private";
  type: "project";
  link: string;
  title: WPRendered;
  content: WPRendered;
  excerpt: WPRendered;
  featured_media: number;
  template: string;
  // Custom taxonomies (term IDs)
  project_category?: number[];
  project_village?: number[];
  project_year?: number[];
  project_status?: number[];
  project_scheme?: number[];
  // Embedded data (when using _embed parameter)
  _embedded?: {
    "wp:featuredmedia"?: WPMedia[];
    "wp:term"?: WPTerm[][];
  };
  _links: WPLinks;
}

/**
 * Clean, frontend-friendly Project type
 *
 * Transformed from WPProject for easy consumption in React components.
 * All HTML is extracted from rendered wrappers, taxonomies are denormalized.
 */
export interface Project {
  id: number;
  slug: string;
  title: string;
  content: string;
  excerpt: string;
  date: string;
  modified: string;
  link: string;
  featuredImage?: FeaturedImage;
  categories: SimpleTerm[];
  villages: SimpleTerm[];
  years: SimpleTerm[];
  statuses: SimpleTerm[];
  schemes: SimpleTerm[];
}

// ============================================================================
// API Response & Pagination Types
// ============================================================================

/**
 * Paginated API response wrapper
 *
 * WordPress returns pagination info in HTTP headers:
 * - X-WP-Total: Total number of items
 * - X-WP-TotalPages: Total number of pages
 */
export interface WPAPIResponse<T> {
  data: T[];
  total: number;
  totalPages: number;
  page: number;
  perPage: number;
}

/**
 * API error response
 */
export interface WPAPIError {
  code: string;
  message: string;
  data?: {
    status: number;
  };
}

/**
 * Result type for API operations
 * Discriminated union for type-safe error handling
 */
export type APIResult<T> =
  | { success: true; data: T }
  | { success: false; error: WPAPIError };

// ============================================================================
// Filter & Query Types
// ============================================================================

/**
 * Project filtering options
 *
 * All filters are optional and can be combined.
 * Taxonomy filters accept either slug or term ID.
 */
export interface ProjectFilters {
  /** Filter by category slug or ID */
  category?: string | number;
  /** Filter by village slug or ID */
  village?: string | number;
  /** Filter by year slug or ID */
  year?: string | number;
  /** Filter by status slug or ID */
  status?: string | number;
  /** Filter by scheme slug or ID */
  scheme?: string | number;
  /** Search query (searches title and content) */
  search?: string;
  /** Page number (1-indexed) */
  page?: number;
  /** Items per page (default: 12) */
  perPage?: number;
  /** Order by field */
  orderBy?: "date" | "title" | "modified";
  /** Order direction */
  order?: "asc" | "desc";
}

/**
 * Taxonomy type identifiers
 */
export type TaxonomyType =
  | "project_category"
  | "project_village"
  | "project_year"
  | "project_status"
  | "project_scheme";

/**
 * Collection of all taxonomy terms for filter UI
 */
export interface TaxonomyCollection {
  categories: WPTerm[];
  villages: WPTerm[];
  years: WPTerm[];
  statuses: WPTerm[];
  schemes: WPTerm[];
}

// ============================================================================
// Cache Configuration Types
// ============================================================================

/**
 * Cache tags for Next.js revalidation
 */
export type CacheTag =
  | "projects"
  | "project"
  | "taxonomies"
  | `project-${string}`;

/**
 * Revalidation strategy configuration
 */
export interface RevalidationConfig {
  /** Revalidation period in seconds */
  revalidate?: number;
  /** Cache tags for on-demand revalidation */
  tags?: CacheTag[];
}
