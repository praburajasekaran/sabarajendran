"use client";

/**
 * URL State Management Hook
 *
 * Synchronizes component state with URL query parameters for shareable links.
 * Implements proper Next.js 15 patterns with useSearchParams and useRouter.
 *
 * WHY: Constituents need shareable filtered views (e.g., "All completed projects in Village X")
 * URL state persistence allows bookmarking and sharing specific filter combinations.
 *
 * @example
 * ```tsx
 * const { params, setParam, removeParam, clearParams, updateParams } = useUrlState();
 *
 * // Set single parameter
 * setParam('category', 'infrastructure');
 *
 * // Update multiple parameters
 * updateParams({ village: 'nannikuppam', year: '2023' });
 *
 * // Clear all parameters
 * clearParams();
 * ```
 */

import { useCallback, useMemo } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

export interface UrlStateOptions {
  /** Scroll to top when URL changes (default: false) */
  scroll?: boolean;
  /** Parameters to preserve when clearing (e.g., ['page']) */
  preserve?: string[];
  /** Debounce delay in ms (default: 0) */
  debounce?: number;
}

export function useUrlState(options: UrlStateOptions = {}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { scroll = false, preserve = [] } = options;

  /**
   * Get current URL parameters as an object
   */
  const params = useMemo(() => {
    const result: Record<string, string | string[]> = {};
    searchParams.forEach((value, key) => {
      const existing = result[key];
      if (existing) {
        result[key] = Array.isArray(existing) ? [...existing, value] : [existing, value];
      } else {
        result[key] = value;
      }
    });
    return result;
  }, [searchParams]);

  /**
   * Build new URL with updated parameters
   */
  const buildUrl = useCallback(
    (updates: Record<string, string | string[] | null | undefined>) => {
      const newParams = new URLSearchParams(searchParams.toString());

      // Apply updates
      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === undefined || value === "") {
          newParams.delete(key);
        } else if (Array.isArray(value)) {
          newParams.delete(key);
          value.forEach((v) => newParams.append(key, v));
        } else {
          newParams.set(key, value);
        }
      });

      const query = newParams.toString();
      return query ? `${pathname}?${query}` : pathname;
    },
    [pathname, searchParams]
  );

  /**
   * Set a single URL parameter
   */
  const setParam = useCallback(
    (key: string, value: string | string[] | null | undefined) => {
      const url = buildUrl({ [key]: value });
      router.push(url, { scroll });
    },
    [buildUrl, router, scroll]
  );

  /**
   * Remove a single URL parameter
   */
  const removeParam = useCallback(
    (key: string) => {
      setParam(key, null);
    },
    [setParam]
  );

  /**
   * Update multiple URL parameters at once
   * More efficient than calling setParam multiple times
   */
  const updateParams = useCallback(
    (updates: Record<string, string | string[] | null | undefined>) => {
      const url = buildUrl(updates);
      router.push(url, { scroll });
    },
    [buildUrl, router, scroll]
  );

  /**
   * Clear all URL parameters (except preserved ones)
   */
  const clearParams = useCallback(() => {
    if (preserve.length === 0) {
      router.push(pathname, { scroll });
      return;
    }

    // Keep only preserved parameters
    const preservedParams: Record<string, string | string[]> = {};
    preserve.forEach((key) => {
      const value = params[key];
      if (value !== undefined) {
        preservedParams[key] = value;
      }
    });

    const newParams = new URLSearchParams();
    Object.entries(preservedParams).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((v) => newParams.append(key, v));
      } else {
        newParams.set(key, value);
      }
    });

    const query = newParams.toString();
    const url = query ? `${pathname}?${query}` : pathname;
    router.push(url, { scroll });
  }, [pathname, params, preserve, router, scroll]);

  /**
   * Get a single parameter value
   */
  const getParam = useCallback(
    (key: string): string | string[] | undefined => {
      return params[key];
    },
    [params]
  );

  /**
   * Check if a parameter exists
   */
  const hasParam = useCallback(
    (key: string): boolean => {
      return params[key] !== undefined;
    },
    [params]
  );

  /**
   * Get parameter as array (useful for multi-select filters)
   */
  const getParamArray = useCallback(
    (key: string): string[] => {
      const value = params[key];
      if (Array.isArray(value)) return value;
      if (value) return [value];
      return [];
    },
    [params]
  );

  return {
    params,
    getParam,
    hasParam,
    getParamArray,
    setParam,
    removeParam,
    updateParams,
    clearParams,
    buildUrl,
  };
}

/**
 * Hook for managing a single URL parameter
 * Simpler API for single-parameter use cases
 *
 * @example
 * ```tsx
 * const [search, setSearch] = useUrlParam('search');
 *
 * <input value={search || ''} onChange={(e) => setSearch(e.target.value)} />
 * ```
 */
export function useUrlParam(
  key: string,
  defaultValue?: string
): [string | undefined, (value: string | null | undefined) => void] {
  const { getParam, setParam } = useUrlState();
  const value = getParam(key);
  const stringValue = Array.isArray(value) ? value[0] : value;

  return [stringValue || defaultValue, (newValue) => setParam(key, newValue)];
}

/**
 * Hook for managing array URL parameters (multi-select)
 *
 * @example
 * ```tsx
 * const [categories, setCategories] = useUrlParamArray('categories');
 *
 * // categories = ['infrastructure', 'healthcare']
 * // URL: ?categories=infrastructure&categories=healthcare
 * ```
 */
export function useUrlParamArray(
  key: string
): [string[], (value: string[] | null) => void] {
  const { getParamArray, setParam } = useUrlState();
  const value = getParamArray(key);

  return [value, (newValue) => setParam(key, newValue)];
}
