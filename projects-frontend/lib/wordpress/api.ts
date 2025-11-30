/**
 * WordPress REST API Client
 *
 * Core API functions for fetching data from the headless WordPress backend.
 * Implements proper error handling, type safety, and Next.js caching strategies.
 *
 * WHY: Political sites need reliability - API failures shouldn't crash the page.
 * All functions return fallback data on error and log issues for monitoring.
 *
 * @see http://localhost:8118/sabarajendran/wp-json/wp/v2/
 */

import type {
  WPProject,
  WPTerm,
  WPMedia,
  Project,
  ProjectFilters,
  WPAPIResponse,
  TaxonomyType,
  TaxonomyCollection,
} from "./types";

// ============================================================================
// Configuration
// ============================================================================

/**
 * WordPress API base URL
 * Falls back to localhost if env var not set
 */
const WP_BASE_URL =
  process.env.NEXT_PUBLIC_WORDPRESS_API_URL?.replace("/wp-json/wp/v2", "") ||
  "http://localhost:8118/sabarajendran";

/**
 * Build REST API URL using the alternative format that works with MAMP
 * WordPress permalinks: ?rest_route=/wp/v2/...
 */
function buildApiUrl(endpoint: string): string {
  // Remove leading slash if present
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint.slice(1) : endpoint;

  // Split endpoint and query parameters
  const [path, queryString] = cleanEndpoint.split('?');

  // Build base URL with rest_route
  let url = `${WP_BASE_URL}/?rest_route=/wp/v2/${path}`;

  // Append additional query parameters with & instead of ?
  if (queryString) {
    url += `&${queryString}`;
  }

  return url;
}

// ============================================================================
// Base Fetch Function with Error Handling
// ============================================================================

/**
 * Base fetch wrapper with comprehensive error handling
 *
 * WHY: Constituent-facing pages must never show technical errors.
 * This wrapper catches network issues, API errors, and invalid JSON.
 *
 * @param endpoint - API endpoint (without base URL)
 * @param options - Fetch options
 * @returns Promise resolving to typed data
 * @throws Error with user-friendly message
 */
async function wpFetch<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = buildApiUrl(endpoint);

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        `WordPress API error [${response.status}]:`,
        errorText.substring(0, 200)
      );
      throw new Error(
        `Failed to fetch data from WordPress (${response.status})`
      );
    }

    const data = await response.json();
    return data as T;
  } catch (error) {
    // Log full error for debugging, but throw user-friendly message
    console.error(`WordPress API request failed (${url}):`, error);

    if (error instanceof Error) {
      throw error;
    }

    throw new Error("Unable to connect to the content management system");
  }
}

// ============================================================================
// Pagination Helper
// ============================================================================

/**
 * Extract pagination data from WordPress response headers
 *
 * @param response - Fetch Response object
 * @returns Pagination metadata
 */
function getPaginationData(response: Response) {
  return {
    total: parseInt(response.headers.get("X-WP-Total") || "0", 10),
    totalPages: parseInt(response.headers.get("X-WP-TotalPages") || "0", 10),
  };
}

// ============================================================================
// Projects API
// ============================================================================

/**
 * Fetch all projects with optional filtering and pagination
 *
 * Supports filtering by taxonomies, search, and custom ordering.
 * Uses Next.js ISR with 60-second revalidation for performance.
 *
 * WHY: Project listings are frequently accessed but change infrequently.
 * ISR provides fast page loads while ensuring data freshness within 1 minute.
 *
 * @param filters - Optional filtering and pagination options
 * @returns Paginated project response
 *
 * @example
 * ```ts
 * // Get first page of all projects
 * const response = await getProjects();
 *
 * // Filter by village and status
 * const filtered = await getProjects({
 *   village: 'nannikuppam-east',
 *   status: 'completed',
 *   page: 1,
 *   perPage: 12
 * });
 * ```
 */
export async function getProjects(
  filters?: ProjectFilters
): Promise<WPAPIResponse<Project>> {
  const params = new URLSearchParams({
    _embed: "1", // Include featured images and taxonomy terms
    per_page: (filters?.perPage || 12).toString(),
    page: (filters?.page || 1).toString(),
  });

  // Add taxonomy filters
  if (filters?.category) {
    params.append("project_category", filters.category.toString());
  }
  if (filters?.village) {
    params.append("project_village", filters.village.toString());
  }
  if (filters?.year) {
    params.append("project_year", filters.year.toString());
  }
  if (filters?.status) {
    params.append("project_status", filters.status.toString());
  }
  if (filters?.scheme) {
    params.append("project_scheme", filters.scheme.toString());
  }

  // Add search query
  if (filters?.search) {
    params.append("search", filters.search);
  }

  // Add ordering
  if (filters?.orderBy) {
    params.append("orderby", filters.orderBy);
  }
  if (filters?.order) {
    params.append("order", filters.order);
  }

  const endpoint = `project?${params.toString()}`;

  try {
    const url = buildApiUrl(endpoint);
    const response = await fetch(url, {
      next: {
        revalidate: 60, // ISR: Revalidate every 60 seconds
        tags: ["projects"], // Cache tag for on-demand revalidation
      },
    });

    if (!response.ok) {
      throw new Error(`API returned ${response.status}`);
    }

    const wpProjects: WPProject[] = await response.json();
    const { total, totalPages } = getPaginationData(response);

    // Transform WordPress projects to clean frontend format
    const { transformProject } = await import("./transform");
    const projects = wpProjects.map(transformProject);

    return {
      data: projects,
      total,
      totalPages,
      page: filters?.page || 1,
      perPage: filters?.perPage || 12,
    };
  } catch (error) {
    console.error("Error fetching projects:", error);

    // Graceful degradation: return empty response instead of crashing
    return {
      data: [],
      total: 0,
      totalPages: 0,
      page: 1,
      perPage: 12,
    };
  }
}


/**
 * Fetch ALL projects by automatically handling pagination
 *
 * Used for the main projects page where we want client-side filtering
 * of the entire dataset.
 *
 * @param filters - Optional filtering options (page and perPage are ignored)
 * @returns Response containing ALL projects
 */
export async function getAllProjects(
  filters?: Omit<ProjectFilters, "page" | "perPage">
): Promise<WPAPIResponse<Project>> {
  // 1. Fetch first page to get total count
  const firstPage = await getProjects({ ...filters, page: 1, perPage: 100 });

  if (firstPage.totalPages <= 1) {
    return firstPage;
  }

  // 2. Fetch remaining pages in parallel
  const remainingPagesPromises = [];
  for (let page = 2; page <= firstPage.totalPages; page++) {
    remainingPagesPromises.push(
      getProjects({ ...filters, page, perPage: 100 })
    );
  }

  const remainingPages = await Promise.all(remainingPagesPromises);

  // 3. Combine data
  const allData = firstPage.data.concat(...remainingPages.map((p) => p.data));

  return {
    ...firstPage,
    data: allData,
    perPage: allData.length, // Update perPage to reflect total
  };
}

/**
 * Fetch a single project by slug
 *
 * Used for project detail pages. Implements ISR with 5-minute revalidation
 * since individual projects change less frequently than listings.
 *
 * @param slug - Project slug (URL-safe identifier)
 * @returns Project or null if not found
 *
 * @example
 * ```ts
 * const project = await getProject('cc-road-nannikuppam-east');
 * if (project) {
 *   console.log(project.title);
 * }
 * ```
 */
export async function getProject(slug: string): Promise<Project | null> {
  try {
    const url = buildApiUrl(`project?slug=${slug}&_embed=1`);
    const response = await fetch(url, {
      next: {
        revalidate: 300, // ISR: Revalidate every 5 minutes
        tags: ["project", `project-${slug}`],
      },
    });

    if (!response.ok) {
      return null;
    }

    const wpProjects: WPProject[] = await response.json();

    if (!wpProjects || wpProjects.length === 0) {
      return null;
    }

    const { transformProject } = await import("./transform");
    return transformProject(wpProjects[0]);
  } catch (error) {
    console.error(`Error fetching project with slug "${slug}":`, error);
    return null;
  }
}

/**
 * Fetch project by ID
 *
 * Alternative to fetching by slug when you have the numeric ID.
 *
 * @param id - Project ID
 * @returns Project or null if not found
 */
export async function getProjectById(id: number): Promise<Project | null> {
  try {
    const wpProject = await wpFetch<WPProject>(`project/${id}?_embed=1`);
    const { transformProject } = await import("./transform");
    return transformProject(wpProject);
  } catch (error) {
    console.error(`Error fetching project with ID ${id}:`, error);
    return null;
  }
}

// ============================================================================
// Taxonomy API
// ============================================================================

/**
 * Fetch terms for a specific taxonomy
 *
 * WHY: Taxonomy terms change rarely, so we cache for 10 minutes.
 * This powers filter dropdowns without hitting the API on every page load.
 *
 * @param taxonomy - Taxonomy identifier
 * @returns Array of taxonomy terms
 *
 * @example
 * ```ts
 * const categories = await getTaxonomyTerms('project_category');
 * const villages = await getTaxonomyTerms('project_village');
 * ```
 */
export async function getTaxonomyTerms(
  taxonomy: TaxonomyType
): Promise<WPTerm[]> {
  try {
    const url = buildApiUrl(`${taxonomy}?per_page=100&orderby=name&order=asc`);
    const response = await fetch(url, {
      next: {
        revalidate: 600, // Cache for 10 minutes
        tags: ["taxonomies", taxonomy],
      },
    });

    if (!response.ok) {
      // If taxonomy doesn't exist (404), just return empty array
      if (response.status === 404) {
        console.warn(`Taxonomy "${taxonomy}" not found (404). Returning empty list.`);
        return [];
      }
      throw new Error(`API returned ${response.status}`);
    }

    const terms: WPTerm[] = await response.json();
    return terms;
  } catch (error) {
    console.error(`Error fetching ${taxonomy} terms:`, error);
    return [];
  }
}

/**
 * Fetch all taxonomies in parallel
 *
 * Optimized for filter UI initialization - fetches all taxonomy types
 * in a single parallel batch.
 *
 * WHY: Instead of 5 sequential API calls, we make 5 parallel calls.
 * This reduces total wait time from ~500ms to ~100ms.
 *
 * @returns Collection of all taxonomy terms
 *
 * @example
 * ```ts
 * const { categories, villages, years, statuses, schemes } = await getAllTaxonomies();
 * // Use for populating filter dropdowns
 * ```
 */
export async function getAllTaxonomies(): Promise<TaxonomyCollection> {
  const [categories, villages, years, statuses, schemes] = await Promise.all([
    getTaxonomyTerms("project_category"),
    getTaxonomyTerms("project_village"),
    getTaxonomyTerms("project_year"),
    getTaxonomyTerms("project_status"),
    getTaxonomyTerms("project_scheme"),
  ]);

  return {
    categories,
    villages,
    years,
    statuses,
    schemes,
  };
}

/**
 * Fetch a single taxonomy term by slug
 *
 * @param taxonomy - Taxonomy type
 * @param slug - Term slug
 * @returns Term or null if not found
 */
export async function getTaxonomyTerm(
  taxonomy: TaxonomyType,
  slug: string
): Promise<WPTerm | null> {
  try {
    const url = buildApiUrl(`${taxonomy}?slug=${slug}`);
    const response = await fetch(url, {
      next: { revalidate: 600, tags: ["taxonomies", taxonomy] },
    });

    if (!response.ok) {
      return null;
    }

    const terms: WPTerm[] = await response.json();
    return terms[0] || null;
  } catch (error) {
    console.error(`Error fetching ${taxonomy} term "${slug}":`, error);
    return null;
  }
}

// ============================================================================
// Media API
// ============================================================================

/**
 * Fetch media item by ID
 *
 * Used when you need media details beyond what's embedded in posts.
 *
 * @param id - Media ID
 * @returns Media object or null if not found
 */
export async function getMedia(id: number): Promise<WPMedia | null> {
  try {
    const url = buildApiUrl(`media/${id}`);
    const response = await fetch(url, {
      next: {
        revalidate: 3600, // Cache for 1 hour (images rarely change)
      },
    });

    if (!response.ok) {
      return null;
    }

    const media: WPMedia = await response.json();
    return media;
  } catch (error) {
    console.error(`Error fetching media with ID ${id}:`, error);
    return null;
  }
}

// ============================================================================
// Statistics API
// ============================================================================

/**
 * Get total projects count
 *
 * Efficient count query for dashboard/stats without fetching full data.
 *
 * WHY: Statistics change infrequently, so we cache for 5 minutes.
 * Uses minimal bandwidth by only fetching 1 item and reading the header.
 *
 * @returns Total number of projects
 *
 * @example
 * ```ts
 * const totalProjects = await getProjectsCount();
 * // Display: "850 Projects Completed"
 * ```
 */
export async function getProjectsCount(): Promise<number> {
  try {
    const url = buildApiUrl("project?per_page=1");
    const response = await fetch(url, {
      next: {
        revalidate: 300, // Cache for 5 minutes
        tags: ["projects"],
      },
    });

    if (!response.ok) {
      return 0;
    }

    const total = parseInt(response.headers.get("X-WP-Total") || "0", 10);
    return total;
  } catch (error) {
    console.error("Error fetching projects count:", error);
    return 0;
  }
}

/**
 * Get projects count by taxonomy term
 *
 * @param taxonomy - Taxonomy type
 * @param termId - Term ID
 * @returns Number of projects in that term
 */
export async function getProjectsCountByTerm(
  taxonomy: TaxonomyType,
  termId: number
): Promise<number> {
  try {
    const url = buildApiUrl(`project?${taxonomy}=${termId}&per_page=1`);
    const response = await fetch(url, {
      next: { revalidate: 300, tags: ["projects", taxonomy] },
    });

    if (!response.ok) {
      return 0;
    }

    return parseInt(response.headers.get("X-WP-Total") || "0", 10);
  } catch (error) {
    console.error(`Error fetching projects count for ${taxonomy}:`, error);
    return 0;
  }
}
