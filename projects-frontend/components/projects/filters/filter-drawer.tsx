"use client";

/**
 * Filter Drawer Component
 *
 * Mobile-responsive drawer for filters with smooth animations.
 * Slides in from the left, includes backdrop, and handles focus management.
 */

import { useEffect, useRef } from "react";
import { X, SlidersHorizontal } from "lucide-react";
import { SearchFilter } from "./search-filter";
import { CategoryFilter } from "./category-filter";
import { VillageFilter } from "./village-filter";
import { YearFilter } from "./year-filter";
import { StatusFilter } from "./status-filter";
import { ActiveFilters, type ActiveFilter } from "./active-filters";
import { cn } from "@/lib/utils";

export interface FilterDrawerProps {
  /** Whether the drawer is open */
  isOpen: boolean;
  /** Close handler */
  onClose: () => void;
  /** Search query */
  searchQuery: string;
  /** Set search query */
  onSearchChange: (query: string) => void;
  /** Available categories */
  categories: Array<{ id: number; slug: string; name: string; count: number }>;
  /** Selected categories */
  selectedCategories: string[];
  /** Change handler for categories */
  onCategoriesChange: (slugs: string[]) => void;
  /** Available villages */
  villages: Array<{ id: number; slug: string; name: string; count: number }>;
  /** Selected villages */
  selectedVillages: string[];
  /** Change handler for villages */
  onVillagesChange: (slugs: string[]) => void;
  /** Available years */
  years: Array<{ id: number; slug: string; name: string; count: number }>;
  /** Selected years */
  selectedYears: string[];
  /** Change handler for years */
  onYearsChange: (slugs: string[]) => void;
  /** Selected statuses (simplified: "completed" or "in-progress") */
  selectedStatuses: string[];
  /** Change handler for statuses */
  onStatusesChange: (slugs: string[]) => void;
  /** Filter counts */
  filterCounts: {
    categories: Record<string, number>;
    villages: Record<string, number>;
    years: Record<string, number>;
    statuses: Record<string, number>;
    schemes: Record<string, number>;
  };
  /** Active filters */
  activeFilters: ActiveFilter[];
  /** Remove single filter */
  onRemoveFilter: (key: string, value: string) => void;
  /** Clear all filters */
  onClearAll: () => void;
}

export function FilterDrawer({
  isOpen,
  onClose,
  searchQuery,
  onSearchChange,
  categories,
  selectedCategories,
  onCategoriesChange,
  villages,
  selectedVillages,
  onVillagesChange,
  years,
  selectedYears,
  onYearsChange,
  selectedStatuses,
  onStatusesChange,
  filterCounts,
  activeFilters,
  onRemoveFilter,
  onClearAll,
}: FilterDrawerProps) {
  const drawerRef = useRef<HTMLDivElement>(null);

  // Handle Escape key to close
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Focus trap
  useEffect(() => {
    if (isOpen && drawerRef.current) {
      const focusableElements = drawerRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

      const handleTab = (e: KeyboardEvent) => {
        if (e.key !== "Tab") return;

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement?.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement?.focus();
          }
        }
      };

      document.addEventListener("keydown", handleTab);
      firstElement?.focus();

      return () => document.removeEventListener("keydown", handleTab);
    }
  }, [isOpen]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <aside
        ref={drawerRef}
        className={cn(
          "fixed left-0 top-0 bottom-0 w-[85vw] max-w-sm bg-white z-50 lg:hidden",
          "transform transition-transform duration-300 ease-out",
          "overflow-y-auto overscroll-contain shadow-2xl",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Filter projects"
      >
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="h-5 w-5 text-primary-600" />
              <h2 className="text-lg font-bold text-gray-900">Filters</h2>
              {activeFilters.length > 0 && (
                <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 bg-primary-600 text-white text-xs font-bold rounded-full">
                  {activeFilters.length}
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2 -mr-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Close filters"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-4 py-6 space-y-6">
          {/* Search */}
          <SearchFilter
            value={searchQuery}
            onChange={onSearchChange}
            placeholder="Search projects..."
            debounce={300}
          />

          {/* Active Filters */}
          {activeFilters.length > 0 && (
            <ActiveFilters
              filters={activeFilters}
              onRemove={onRemoveFilter}
              onClearAll={onClearAll}
            />
          )}

          {/* Filter Sections */}
          <div className="space-y-6">
            {/* Status Filter */}
            <StatusFilter
              selected={selectedStatuses}
              onChange={onStatusesChange}
              filterCounts={filterCounts.statuses}
            />

            {/* Category Filter */}
            {categories.length > 0 && (
              <CategoryFilter
                categories={categories}
                selected={selectedCategories}
                onChange={onCategoriesChange}
                filterCounts={filterCounts.categories}
              />
            )}

            {/* Village Filter */}
            {villages.length > 0 && (
              <VillageFilter
                villages={villages}
                selected={selectedVillages}
                onChange={onVillagesChange}
                filterCounts={filterCounts.villages}
              />
            )}

            {/* Year Filter */}
            {years.length > 0 && (
              <YearFilter
                years={years}
                selected={selectedYears}
                onChange={onYearsChange}
                filterCounts={filterCounts.years}
              />
            )}
          </div>
        </div>

        {/* Footer - Apply/Close buttons for mobile */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-4 py-4">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors"
          >
            View Results
          </button>
        </div>
      </aside>
    </>
  );
}
