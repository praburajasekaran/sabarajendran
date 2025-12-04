"use client";

/**
 * Project Filters Hook
 *
 * Centralized hook for managing project filtering state and logic.
 * Integrates URL state, client-side filtering, and memoization for performance.
 *
 * WHY: Complex filtering logic needs to be reusable and performant.
 * This hook provides a single source of truth for filter state across components.
 *
 * @example
 * ```tsx
 * const {
 *   filteredProjects,
 *   filters,
 *   setFilter,
 *   clearFilters,
 *   activeFilterCount
 * } = useProjectFilters(allProjects, taxonomies);
 * ```
 */

import { useMemo, useCallback, useEffect, useRef } from "react";
import { useUrlState } from "./use-url-state";
import { filterProjects, sortProjects, getFilterCounts, hasActiveFilters, countActiveFilters, type FilterCriteria, type SortOption } from "@/lib/utils/filter-projects";
import { searchProjects } from "@/lib/utils/search-projects";
import type { Project } from "@/lib/wordpress/types";

export interface ProjectFiltersHook {
  /** Filtered and sorted projects */
  filteredProjects: Project[];
  /** Current filter criteria */
  filters: FilterCriteria;
  /** Current sort option */
  sortBy: SortOption;
  /** Search query */
  searchQuery: string;
  /** Set a single filter */
  setFilter: (key: keyof FilterCriteria, value: string[] | string | undefined) => void;
  /** Toggle a filter value (for multi-select) */
  toggleFilter: (key: keyof FilterCriteria, value: string) => void;
  /** Set search query */
  setSearch: (query: string) => void;
  /** Set sort option */
  setSort: (sort: SortOption) => void;
  /** Clear all filters */
  clearFilters: () => void;
  /** Clear a specific filter */
  clearFilter: (key: keyof FilterCriteria) => void;
  /** Check if any filters are active */
  hasFilters: boolean;
  /** Count of active filters */
  activeFilterCount: number;
  /** Filter counts for each taxonomy */
  filterCounts: ReturnType<typeof getFilterCounts>;
  /** Total matching projects */
  totalResults: number;
  /** All filtered projects (before pagination) */
  allFilteredProjects: Project[];
  /** Pagination controls */
  pagination: {
    currentPage: number;
    totalPages: number;
    setPage: (page: number) => void;
    itemsPerPage: number;
  };
}

export interface TaxonomyData {
  categories: Array<{ id: number; slug: string; name: string; count: number }>;
  villages: Array<{ id: number; slug: string; name: string; count: number }>;
  years: Array<{ id: number; slug: string; name: string; count: number }>;
  statuses: Array<{ id: number; slug: string; name: string; count: number }>;
  schemes: Array<{ id: number; slug: string; name: string; count: number }>;
}

/**
 * Main project filters hook
 */
export function useProjectFilters(
  projects: Project[],
  taxonomies: TaxonomyData
): ProjectFiltersHook {
  const { params, setParam, updateParams, clearParams } = useUrlState();

  // Extract filter values from URL params
  const filters = useMemo<FilterCriteria>(() => {
    const getParamArray = (key: string): string[] | undefined => {
      const value = params[key];
      if (!value) return undefined;
      if (Array.isArray(value)) return value;
      return value.split(",").filter(Boolean);
    };

    return {
      categories: getParamArray("categories"),
      villages: getParamArray("villages"),
      years: getParamArray("years"),
      statuses: getParamArray("statuses"),
      schemes: getParamArray("schemes"),
      search: typeof params.search === "string" ? params.search : undefined,
    };
  }, [params]);

  // Get sort option from URL
  const sortBy = (params.sort as SortOption) || "date-desc";
  const searchQuery = filters.search || "";

  // Memoized filtered projects (expensive operation)
  const filteredProjects = useMemo(() => {
    let result = filterProjects(projects, filters);
    result = sortProjects(result, sortBy, searchQuery);
    return result;
  }, [projects, filters, sortBy, searchQuery]);

  // Memoized filter counts
  const filterCounts = useMemo(() => {
    return getFilterCounts(projects, filters);
  }, [projects, filters]);

  // Check if filters are active
  const hasFilters = useMemo(() => hasActiveFilters(filters), [filters]);

  // Count active filters
  const activeFilterCount = useMemo(() => countActiveFilters(filters), [filters]);

  /**
   * Set a single filter value
   */
  const setFilter = useCallback(
    (key: keyof FilterCriteria, value: string[] | string | undefined) => {
      if (!value || (Array.isArray(value) && value.length === 0)) {
        setParam(key, null);
      } else if (Array.isArray(value)) {
        setParam(key, value.join(","));
      } else {
        setParam(key, value);
      }
    },
    [setParam]
  );

  /**
   * Toggle a filter value (for multi-select)
   */
  const toggleFilter = useCallback(
    (key: keyof FilterCriteria, value: string) => {
      const current = filters[key];
      let newValue: string[];

      if (!current) {
        newValue = [value];
      } else if (Array.isArray(current)) {
        if (current.includes(value)) {
          newValue = current.filter((v) => v !== value);
        } else {
          newValue = [...current, value];
        }
      } else if (typeof current === "string") {
        if (current === value) {
          newValue = [];
        } else {
          newValue = [current, value];
        }
      } else {
        newValue = [value];
      }

      setFilter(key, newValue.length > 0 ? newValue : undefined);
    },
    [filters, setFilter]
  );

  /**
   * Set search query
   */
  const setSearch = useCallback(
    (query: string) => {
      setFilter("search", query.trim() || undefined);
    },
    [setFilter]
  );

  /**
   * Set sort option
   */
  const setSort = useCallback(
    (sort: SortOption) => {
      setParam("sort", sort === "date-desc" ? null : sort);
    },
    [setParam]
  );

  /**
   * Clear all filters
   */
  const clearFilters = useCallback(() => {
    clearParams();
  }, [clearParams]);

  /**
   * Clear a specific filter
   */
  const clearFilter = useCallback(
    (key: keyof FilterCriteria) => {
      setFilter(key, undefined);
    },
    [setFilter]
  );

  // Pagination
  const pageParam = params.page;
  const currentPage = parseInt(
    (Array.isArray(pageParam) ? pageParam[0] : pageParam) || "1",
    10
  );
  const itemsPerPage = 12;

  // Track previous filter values to detect actual changes (not page changes)
  const prevFiltersRef = useRef<{
    categories?: string[];
    villages?: string[];
    years?: string[];
    statuses?: string[];
    schemes?: string[];
    search?: string;
    sortBy: SortOption;
  } | null>(null);
  const isInitialMount = useRef(true);

  // Reset page to 1 when filters actually change (not on initial render or page changes)
  useEffect(() => {
    // Skip on initial mount
    if (isInitialMount.current) {
      isInitialMount.current = false;
      prevFiltersRef.current = {
        categories: filters.categories,
        villages: filters.villages,
        years: filters.years,
        statuses: filters.statuses,
        schemes: filters.schemes,
        search: filters.search,
        sortBy: sortBy,
      };
      return;
    }

    const prev = prevFiltersRef.current;
    if (!prev) return;

    const filtersChanged =
      JSON.stringify(prev.categories) !== JSON.stringify(filters.categories) ||
      JSON.stringify(prev.villages) !== JSON.stringify(filters.villages) ||
      JSON.stringify(prev.years) !== JSON.stringify(filters.years) ||
      JSON.stringify(prev.statuses) !== JSON.stringify(filters.statuses) ||
      JSON.stringify(prev.schemes) !== JSON.stringify(filters.schemes) ||
      prev.search !== filters.search ||
      prev.sortBy !== sortBy;

    // Only reset page if filters actually changed (not on page changes)
    if (filtersChanged && currentPage !== 1) {
      setParam("page", "1");
    }

    // Update ref for next comparison
    prevFiltersRef.current = {
      categories: filters.categories,
      villages: filters.villages,
      years: filters.years,
      statuses: filters.statuses,
      schemes: filters.schemes,
      search: filters.search,
      sortBy: sortBy,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    filters.categories,
    filters.villages,
    filters.years,
    filters.statuses,
    filters.schemes,
    filters.search,
    sortBy,
    setParam,
  ]);

  // Paginate results
  const totalPages = Math.max(1, Math.ceil(filteredProjects.length / itemsPerPage));
  const paginatedProjects = useMemo(() => {
    if (filteredProjects.length === 0) return [];
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProjects.slice(start, start + itemsPerPage);
  }, [filteredProjects, currentPage, itemsPerPage]);

  const setPage = useCallback(
    (page: number) => {
      // Clamp page to valid range (1 to totalPages)
      const clampedPage = Math.max(1, Math.min(page, totalPages));
      if (clampedPage !== currentPage) {
        setParam("page", clampedPage.toString());
        // Scroll to top of results
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    },
    [setParam, totalPages, currentPage]
  );

  return {
    filteredProjects: paginatedProjects, // Return paginated projects as the main list
    allFilteredProjects: filteredProjects, // Return all matching projects if needed
    filters,
    sortBy,
    searchQuery,
    setFilter,
    toggleFilter,
    setSearch,
    setSort,
    clearFilters,
    clearFilter,
    hasFilters,
    activeFilterCount,
    filterCounts,
    totalResults: filteredProjects.length, // Total filtered projects (before pagination)
    pagination: {
      currentPage,
      totalPages,
      setPage,
      itemsPerPage,
    },
  };
}

/**
 * Hook for debounced search
 */
export function useDebouncedSearch(delay: number = 300) {
  const { params, setParam } = useUrlState();
  const searchQuery = typeof params.search === "string" ? params.search : "";

  const setSearch = useCallback(
    (query: string) => {
      setParam("search", query.trim() || undefined);
    },
    [setParam]
  );

  return { searchQuery, setSearch };
}
