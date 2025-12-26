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

  // Initialize filter state from URL
  const [filters, setFilters] = useState<FilterState>(() => {
    if (typeof window === 'undefined') {
      return getDefaultFilterState();
    }

    // Parse URL slugs into filter state
    const parsedFilters = parseProjectsUrl(window.location.pathname, searchParams);

    // Convert slugs to display names if mapper is available
    if (locationMapper) {
      return {
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
    }

    return parsedFilters;
  });

  // Sync filter state when URL changes (browser back/forward)
  useEffect(() => {
    const pathname = window.location.pathname;
    const parsedFilters = parseProjectsUrl(pathname, searchParams);

    // Convert slugs to display names
    if (locationMapper) {
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
    }
  }, [
    params.blockSlug,
    params.panchayatSlug,
    params.villageSlug,
    searchParams.toString(), // Watch for query param changes
    locationMapper
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
    resetFilters
  };
};
