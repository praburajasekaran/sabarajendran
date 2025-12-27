/**
 * URL Filters Hook
 *
 * Custom React hook for bidirectional synchronization between URL parameters and filter state.
 * Handles:
 * - Reading URL params on mount
 * - Updating URL when filters change
 * - Browser back/forward navigation
 * - UTM parameter preservation
 * - Slug <-> display name conversion
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { Project } from '../types';
import {
  FilterState,
  buildProjectsUrl,
  parseProjectsUrl,
  getDefaultFilterState
} from '../utils/urlBuilder';
import { getLocationMapper } from '../utils/slugMapping';

interface UseUrlFiltersOptions {
  projects: Project[];
}

interface UseUrlFiltersReturn {
  filters: FilterState;
  updateFilters: (newFilters: Partial<FilterState>, options?: { replace?: boolean }) => void;
  resetFilters: () => void;
  hasInitialized: boolean;
}

/**
 * Hook for managing filter state via URL parameters
 *
 * @example
 * const { filters, updateFilters, resetFilters } = useUrlFilters({ projects });
 *
 * // Update a single filter
 * updateFilters({ block: 'Kurinjipadi' });
 *
 * // Update multiple filters
 * updateFilters({ type: 'Water Supply', status: 'Completed' });
 *
 * // Reset all filters
 * resetFilters();
 */
export const useUrlFilters = ({ projects }: UseUrlFiltersOptions): UseUrlFiltersReturn => {
  const params = useParams<{
    blockSlug?: string;
    panchayatSlug?: string;
    villageSlug?: string;
  }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Get location mapper for slug conversions
  const locationMapper = useMemo(
    () => (projects.length > 0 ? getLocationMapper(projects) : null),
    [projects.length] // Only recreate when project count changes
  );

  // Initialize filter state with defaults (URL will be processed after projects load)
  const [filters, setFilters] = useState<FilterState>(() => {
    if (typeof window === 'undefined') {
      return getDefaultFilterState();
    }

    // Start with default filters - we'll convert URL slugs after projects load
    return getDefaultFilterState();
  });

  // Track if we've done the initial URL->filter conversion
  const [hasInitialized, setHasInitialized] = useState(false);

  // Initialize filters from URL once projects are loaded, then sync on URL changes
  useEffect(() => {
    const pathname = window.location.pathname;
    const parsedFilters = parseProjectsUrl(pathname, searchParams);

    // Check if URL has any active filters (not all defaults)
    const hasUrlFilters =
      parsedFilters.block !== 'All' ||
      parsedFilters.panchayat !== 'All' ||
      parsedFilters.village !== null ||
      parsedFilters.type !== 'All' ||
      parsedFilters.status !== 'All' ||
      parsedFilters.scheme !== 'All' ||
      parsedFilters.year !== 'All' ||
      parsedFilters.search !== '';

    // If no URL filters, mark as initialized immediately
    if (!hasUrlFilters && !hasInitialized) {
      setFilters(parsedFilters);
      setHasInitialized(true);
      return;
    }

    // For URLs with filters, wait for sufficient project data to ensure slug mappings exist
    if (!locationMapper || projects.length < 50) {
      return; // Wait for more projects to load
    }

    // Convert slugs to display names using the location mapper
    const convertedFilters: FilterState = {
      ...parsedFilters,
      block: parsedFilters.block !== 'All'
        ? (locationMapper.getName(parsedFilters.block, 'block') || parsedFilters.block)
        : 'All',
      panchayat: parsedFilters.panchayat !== 'All'
        ? (locationMapper.getName(parsedFilters.panchayat, 'panchayat') || parsedFilters.panchayat)
        : 'All',
      village: parsedFilters.village
        ? (locationMapper.getName(parsedFilters.village, 'village') || parsedFilters.village)
        : null,
      // Use LocationMapper for filter values to ensure exact match
      type: parsedFilters.type !== 'All'
        ? (locationMapper.getName(parsedFilters.type, 'type') || parsedFilters.type)
        : 'All',
      status: parsedFilters.status !== 'All'
        ? (locationMapper.getName(parsedFilters.status, 'status') || parsedFilters.status)
        : 'All',
      scheme: parsedFilters.scheme !== 'All'
        ? (locationMapper.getName(parsedFilters.scheme, 'scheme') || parsedFilters.scheme)
        : 'All',
      year: parsedFilters.year,
      search: parsedFilters.search,
      page: parsedFilters.page
    };

    setFilters(convertedFilters);

    // Mark initialization as complete after first conversion
    if (!hasInitialized) {
      setHasInitialized(true);
    }
  }, [
    params.blockSlug,
    params.panchayatSlug,
    params.villageSlug,
    searchParams.toString(), // Watch for query param changes
    locationMapper,
    projects.length, // Re-convert when project count changes significantly
    hasInitialized
  ]);

  /**
   * Update filter state and URL
   *
   * @param newFilters Partial filter state to update
   * @param options.replace Whether to replace current history entry (default: true)
   */
  const updateFilters = useCallback(
    (newFilters: Partial<FilterState>, options: { replace?: boolean } = { replace: true }) => {
      // Merge with existing filters
      const updatedFilters: FilterState = { ...filters, ...newFilters };

      // Update local state immediately (optimistic update)
      setFilters(updatedFilters);

      // Extract UTM parameters from current URL to preserve them
      const utmParams = new URLSearchParams();
      const utmKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];

      utmKeys.forEach(key => {
        const value = searchParams.get(key);
        if (value) {
          utmParams.set(key, value);
        }
      });

      // Build new URL
      const newUrl = buildProjectsUrl({
        block: updatedFilters.block,
        panchayat: updatedFilters.panchayat,
        village: updatedFilters.village || undefined,
        type: updatedFilters.type,
        status: updatedFilters.status,
        year: updatedFilters.year,
        scheme: updatedFilters.scheme,
        search: updatedFilters.search,
        page: updatedFilters.page,
        preserveParams: utmParams
      });

      // Navigate to new URL
      navigate(newUrl, { replace: options.replace });
    },
    [filters, searchParams, navigate]
  );

  /**
   * Reset all filters to default state
   */
  const resetFilters = useCallback(() => {
    const defaultFilters = getDefaultFilterState();
    setFilters(defaultFilters);

    // Navigate to clean /projects URL
    navigate('/projects', { replace: true });
  }, [navigate]);

  return {
    filters,
    updateFilters,
    resetFilters,
    hasInitialized
  };
};
