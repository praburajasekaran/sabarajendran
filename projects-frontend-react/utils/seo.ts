/**
 * SEO Utilities for Filtered Project Pages
 *
 * Generates dynamic meta tags, titles, descriptions, and implements
 * strategic indexing decisions for filtered project pages.
 */

import { FilterState } from './urlBuilder';

const SITE_URL = import.meta.env.VITE_SITE_URL || 'https://sabarajendran.com';
const SITE_NAME = 'Saba Rajendran MLA';

/**
 * Generate page title based on active filters
 *
 * @example
 * generateFilteredTitle({block: "Kurinjipadi", type: "Water Supply"}, "en")
 * // "Water Supply Projects in Kurinjipadi | Saba Rajendran MLA"
 */
export const generateFilteredTitle = (filters: FilterState, lang: string = 'en'): string => {
  const parts: string[] = [];

  // Build descriptive title from filters
  if (filters.type && filters.type !== 'All') {
    parts.push(filters.type);
  }

  if (filters.status && filters.status !== 'All') {
    parts.push(filters.status);
  }

  parts.push('Projects');

  // Add location context
  if (filters.village) {
    parts.push(`in ${filters.village}`);
  } else if (filters.panchayat && filters.panchayat !== 'All') {
    parts.push(`in ${filters.panchayat}`);
  } else if (filters.block && filters.block !== 'All') {
    parts.push(`in ${filters.block}`);
  }

  // Add year context
  if (filters.year && filters.year !== 'All') {
    parts.push(`(${filters.year})`);
  }

  const titleText = parts.join(' ');
  return `${titleText} | ${SITE_NAME}`;
};

/**
 * Generate page description based on active filters and result count
 */
export const generateFilteredDescription = (
  filters: FilterState,
  resultCount: number,
  lang: string = 'en'
): string => {
  // Build descriptive text
  let description = `View ${resultCount} `;

  if (filters.status && filters.status !== 'All') {
    description += `${filters.status.toLowerCase()} `;
  }

  if (filters.type && filters.type !== 'All') {
    description += `${filters.type.toLowerCase()} `;
  }

  description += 'development projects';

  // Add location context
  if (filters.village) {
    description += ` in ${filters.village} village`;
  } else if (filters.panchayat && filters.panchayat !== 'All') {
    description += ` in ${filters.panchayat} panchayat`;
  } else if (filters.block && filters.block !== 'All') {
    description += ` in ${filters.block} block`;
  }

  // Add year context
  if (filters.year && filters.year !== 'All') {
    description += ` for ${filters.year}`;
  }

  description += `. Track project status, budgets, and completion details under the leadership of Saba Rajendran, MLA for Neyveli Constituency.`;

  return description;
};

/**
 * Determine if a filtered page should be indexed by search engines
 *
 * Strategy:
 * - ✅ Index: Location-only pages (block/panchayat/village)
 * - ✅ Index: Location + single filter (type OR status OR year)
 * - ❌ NoIndex: Multiple filters combined
 * - ❌ NoIndex: Search queries
 * - ❌ NoIndex: Pagination beyond page 1
 */
export const shouldIndexFilteredPage = (filters: FilterState): boolean => {
  // Never index search queries
  if (filters.search && filters.search.trim()) {
    return false;
  }

  // Never index paginated pages
  if (filters.page > 1) {
    return false;
  }

  // Count how many non-location filters are active
  const nonLocationFilterCount = [
    filters.type !== 'All' ? 1 : 0,
    filters.status !== 'All' ? 1 : 0,
    filters.year !== 'All' ? 1 : 0
  ].reduce((a, b) => a + b, 0);

  // Index if:
  // 1. No filters (main projects page)
  // 2. Location filters only
  // 3. Location + exactly 1 other filter
  return nonLocationFilterCount <= 1;
};

/**
 * Generate canonical URL for the current filter state
 *
 * Rules:
 * - Paginated pages → canonical points to page 1
 * - Normalized filter order (block > panchayat > village > type > status > year)
 * - Remove default/redundant values
 */
export const generateCanonicalUrl = (filters: FilterState): string => {
  // Build clean URL without page parameter
  const cleanFilters = { ...filters, page: 1 };

  let pathname = '/projects';

  // Add location hierarchy to pathname
  if (cleanFilters.block && cleanFilters.block !== 'All') {
    pathname += `/${slugify(cleanFilters.block)}`;

    if (cleanFilters.panchayat && cleanFilters.panchayat !== 'All') {
      pathname += `/${slugify(cleanFilters.panchayat)}`;

      if (cleanFilters.village) {
        pathname += `/${slugify(cleanFilters.village)}`;
      }
    }
  }

  // Add query parameters in canonical order
  const params = new URLSearchParams();

  if (cleanFilters.type && cleanFilters.type !== 'All') {
    params.set('type', slugify(cleanFilters.type));
  }

  if (cleanFilters.status && cleanFilters.status !== 'All') {
    params.set('status', slugify(cleanFilters.status));
  }

  if (cleanFilters.year && cleanFilters.year !== 'All') {
    params.set('year', cleanFilters.year);
  }

  const queryString = params.toString();
  const fullPath = queryString ? `${pathname}?${queryString}` : pathname;

  return `${SITE_URL}${fullPath}`;
};

/**
 * Generate structured data (JSON-LD) for projects
 *
 * Creates schema.org markup for:
 * - Government organization
 * - Geographic area served
 * - Projects overview
 */
export const generateProjectStructuredData = (
  filters: FilterState,
  projectCount: number
): object => {
  const baseData: any = {
    '@context': 'https://schema.org',
    '@type': 'GovernmentOrganization',
    name: 'Neyveli Constituency Office',
    description: 'Development projects under Saba Rajendran, MLA for Neyveli Constituency',
    url: SITE_URL,
    member: {
      '@type': 'Person',
      name: 'Saba Rajendran',
      jobTitle: 'Member of Legislative Assembly',
      affiliation: {
        '@type': 'Organization',
        name: 'Dravida Munnetra Kazhagam (DMK)'
      }
    }
  };

  // Add area served if location filter is active
  if (filters.block && filters.block !== 'All') {
    baseData.areaServed = {
      '@type': 'AdministrativeArea',
      name: filters.block
    };

    if (filters.panchayat && filters.panchayat !== 'All') {
      baseData.areaServed.containedInPlace = {
        '@type': 'AdministrativeArea',
        name: filters.panchayat
      };
    }

    if (filters.village) {
      baseData.areaServed.containedInPlace = {
        '@type': 'Place',
        name: filters.village
      };
    }
  }

  // Add project count
  baseData.numberOfProjects = projectCount;

  return baseData;
};

/**
 * Generate Open Graph meta tags for social sharing
 */
export const generateOpenGraphTags = (
  filters: FilterState,
  resultCount: number,
  lang: string = 'en'
): Record<string, string> => {
  const title = generateFilteredTitle(filters, lang);
  const description = generateFilteredDescription(filters, resultCount, lang);
  const url = generateCanonicalUrl(filters);

  return {
    'og:title': title,
    'og:description': description,
    'og:url': url,
    'og:type': 'website',
    'og:site_name': SITE_NAME,
    'og:locale': lang === 'ta' ? 'ta_IN' : 'en_IN'
    // Add og:image if you have a featured image for projects
  };
};

/**
 * Generate Twitter Card meta tags
 */
export const generateTwitterCardTags = (
  filters: FilterState,
  resultCount: number,
  lang: string = 'en'
): Record<string, string> => {
  const title = generateFilteredTitle(filters, lang);
  const description = generateFilteredDescription(filters, resultCount, lang);

  return {
    'twitter:card': 'summary_large_image',
    'twitter:title': title,
    'twitter:description': description
    // Add twitter:image if you have a featured image
  };
};

/**
 * Helper: Slugify text (duplicate from urlBuilder for independence)
 */
const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

/**
 * Generate Organization schema for Neyveli Constituency Office
 */
export const generateOrganizationSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'GovernmentOrganization',
  name: 'Neyveli Constituency Office',
  url: SITE_URL,
  logo: `${SITE_URL}/og-image.jpg`,
  description: 'Official office of Saba Rajendran, MLA for Neyveli Constituency, Tamil Nadu',
  areaServed: {
    '@type': 'AdministrativeArea',
    name: 'Neyveli Constituency',
    containedInPlace: {
      '@type': 'State',
      name: 'Tamil Nadu',
      containedInPlace: {
        '@type': 'Country',
        name: 'India'
      }
    }
  },
  parentOrganization: {
    '@type': 'Organization',
    name: 'Dravida Munnetra Kazhagam (DMK)'
  }
});

/**
 * Generate Person schema for MLA Saba Rajendran
 */
export const generatePersonSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Saba Rajendran',
  givenName: 'Saba',
  familyName: 'Rajendran',
  jobTitle: 'Member of Legislative Assembly',
  description: 'MLA representing Neyveli Constituency in Tamil Nadu Legislative Assembly',
  affiliation: {
    '@type': 'Organization',
    name: 'Dravida Munnetra Kazhagam (DMK)'
  },
  worksFor: {
    '@type': 'GovernmentOrganization',
    name: 'Tamil Nadu Legislative Assembly'
  },
  knowsAbout: [
    'Constituency Development',
    'Rural Infrastructure',
    'Water Supply Management',
    'Education Development'
  ]
});

/**
 * Get breadcrumb structured data for location hierarchy
 */
export const generateBreadcrumbStructuredData = (filters: FilterState): object | null => {
  const items: any[] = [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: SITE_URL
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Projects',
      item: `${SITE_URL}/projects`
    }
  ];

  let position = 3;

  if (filters.block && filters.block !== 'All') {
    items.push({
      '@type': 'ListItem',
      position: position++,
      name: filters.block,
      item: `${SITE_URL}/projects/${slugify(filters.block)}`
    });

    if (filters.panchayat && filters.panchayat !== 'All') {
      items.push({
        '@type': 'ListItem',
        position: position++,
        name: filters.panchayat,
        item: `${SITE_URL}/projects/${slugify(filters.block)}/${slugify(filters.panchayat)}`
      });

      if (filters.village) {
        items.push({
          '@type': 'ListItem',
          position: position++,
          name: filters.village,
          item: `${SITE_URL}/projects/${slugify(filters.block)}/${slugify(filters.panchayat)}/${slugify(filters.village)}`
        });
      }
    }
  }

  // Only return breadcrumbs if there's a meaningful hierarchy
  if (items.length <= 2) {
    return null;
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items
  };
};
