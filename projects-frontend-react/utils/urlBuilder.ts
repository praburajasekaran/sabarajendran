/**
 * URL Builder Utilities for Projects Filtering
 *
 * Pure functions for URL construction, parsing, and slug generation.
 * Handles the hybrid URL structure: clean routes for locations + query params for filters
 */

export interface FilterState {
  block: string;
  panchayat: string;
  village: string | null;
  type: string;
  status: string;
  year: string;
  scheme: string;
  search: string;
  page: number;
}

/**
 * Convert text to URL-friendly slug
 *
 * @example
 * slugify("Kurinjipadi Block") // "kurinjipadi-block"
 * slugify("Indira Nagar") // "indira-nagar"
 * slugify("Annadhanampēttai") // "annadhanampettai"
 */
export const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .normalize('NFD') // Decompose special characters
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/[^\w\s-]/g, '') // Remove special chars except spaces and hyphens
    .replace(/[\s_]+/g, '-') // Replace spaces/underscores with single hyphen
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
};

/**
 * Convert slug back to title case (for display)
 *
 * @example
 * deslugify("kurinjipadi-block") // "Kurinjipadi Block"
 */
export const deslugify = (slug: string): string => {
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

interface BuildUrlParams {
  block?: string;
  panchayat?: string;
  village?: string;
  type?: string;
  status?: string;
  year?: string;
  scheme?: string;
  search?: string;
  page?: number;
  preserveParams?: URLSearchParams; // For preserving UTM parameters
}

/**
 * Build clean project URL with location hierarchy and query parameters
 *
 * @example
 * buildProjectsUrl({ block: "Kurinjipadi" })
 * // "/projects/kurinjipadi"
 *
 * buildProjectsUrl({ block: "Kurinjipadi", type: "Water Supply" })
 * // "/projects/kurinjipadi?type=water-supply"
 *
 * buildProjectsUrl({
 *   block: "Kurinjipadi",
 *   panchayat: "Annadhanamettai",
 *   type: "Education",
 *   preserveParams: new URLSearchParams("utm_source=facebook")
 * })
 * // "/projects/kurinjipadi/annadhanamettai?type=education&utm_source=facebook"
 */
export const buildProjectsUrl = (params: BuildUrlParams): string => {
  const {
    block,
    panchayat,
    village,
    type,
    status,
    year,
    scheme,
    search,
    page,
    preserveParams
  } = params;

  // Build the pathname from location hierarchy
  let pathname = '/projects';

  if (block && block !== 'All') {
    pathname += `/${slugify(block)}`;

    if (panchayat && panchayat !== 'All') {
      pathname += `/${slugify(panchayat)}`;

      if (village) {
        pathname += `/${slugify(village)}`;
      }
    }
  }

  // Build query parameters
  const queryParams = new URLSearchParams();

  // Add filter params
  if (type && type !== 'All') {
    queryParams.set('type', slugify(type));
  }

  if (status && status !== 'All') {
    queryParams.set('status', slugify(status));
  }

  if (year && year !== 'All') {
    queryParams.set('year', year); // Keep year as-is (e.g., "2024-2025")
  }

  if (scheme && scheme !== 'All') {
    queryParams.set('scheme', slugify(scheme));
  }

  if (search && search.trim()) {
    queryParams.set('search', search.trim());
  }

  if (page && page > 1) {
    queryParams.set('page', page.toString());
  }

  // Preserve existing params (UTM parameters)
  if (preserveParams) {
    preserveParams.forEach((value, key) => {
      // Don't override filter params with preserved params
      if (!queryParams.has(key)) {
        queryParams.set(key, value);
      }
    });
  }

  // Combine pathname and query string
  const queryString = queryParams.toString();
  return queryString ? `${pathname}?${queryString}` : pathname;
};

/**
 * Parse URL into filter state object
 *
 * @example
 * parseProjectsUrl("/projects/kurinjipadi/annadhanamettai", new URLSearchParams("type=water"))
 * // { block: "kurinjipadi", panchayat: "annadhanamettai", village: null, type: "water", ... }
 */
export const parseProjectsUrl = (
  pathname: string,
  searchParams: URLSearchParams
): FilterState => {
  // Parse pathname segments
  const segments = pathname.split('/').filter(Boolean);
  // segments[0] should be "projects"

  let block = 'All';
  let panchayat = 'All';
  let village: string | null = null;

  if (segments.length >= 2) {
    block = segments[1]; // Already a slug
  }

  if (segments.length >= 3) {
    panchayat = segments[2]; // Already a slug
  }

  if (segments.length >= 4) {
    village = segments[3]; // Already a slug
  }

  // Parse query parameters
  const type = searchParams.get('type') || 'All';
  const status = searchParams.get('status') || 'All';
  const year = searchParams.get('year') || 'All';
  const scheme = searchParams.get('scheme') || 'All';
  const search = searchParams.get('search') || '';
  const page = parseInt(searchParams.get('page') || '1', 10);

  return {
    block,
    panchayat,
    village,
    type,
    status,
    year,
    scheme,
    search,
    page: isNaN(page) ? 1 : page
  };
};

/**
 * Normalize filter state by removing default values
 * Useful for comparing filter states or determining if filters are active
 */
export const normalizeFilterState = (filters: FilterState): Partial<FilterState> => {
  const normalized: Partial<FilterState> = {};

  if (filters.block !== 'All') normalized.block = filters.block;
  if (filters.panchayat !== 'All') normalized.panchayat = filters.panchayat;
  if (filters.village) normalized.village = filters.village;
  if (filters.type !== 'All') normalized.type = filters.type;
  if (filters.status !== 'All') normalized.status = filters.status;
  if (filters.year !== 'All') normalized.year = filters.year;
  if (filters.scheme !== 'All') normalized.scheme = filters.scheme;
  if (filters.search) normalized.search = filters.search;
  if (filters.page > 1) normalized.page = filters.page;

  return normalized;
};

/**
 * Check if any filters are active (not at default values)
 */
export const hasActiveFilters = (filters: FilterState): boolean => {
  return (
    filters.block !== 'All' ||
    filters.panchayat !== 'All' ||
    filters.village !== null ||
    filters.type !== 'All' ||
    filters.status !== 'All' ||
    filters.year !== 'All' ||
    filters.scheme !== 'All' ||
    filters.search !== ''
  );
};

/**
 * Get default filter state
 */
export const getDefaultFilterState = (): FilterState => ({
  block: 'All',
  panchayat: 'All',
  village: null,
  type: 'All',
  status: 'All',
  year: 'All',
  scheme: 'All',
  search: '',
  page: 1
});
