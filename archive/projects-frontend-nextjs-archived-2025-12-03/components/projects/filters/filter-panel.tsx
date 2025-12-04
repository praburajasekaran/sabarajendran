"use client";

/**
 * Filter Panel Component
 *
 * Main desktop filter sidebar containing all filter controls.
 * Sticky positioning for persistent visibility while scrolling.
 */

import { SearchFilter } from "./search-filter";
import { CategoryFilter } from "./category-filter";
import { VillageFilter } from "./village-filter";
import { YearFilter } from "./year-filter";
import { StatusFilter } from "./status-filter";
import { ActiveFilters, type ActiveFilter } from "./active-filters";
import { cn } from "@/lib/utils";
import { SlidersHorizontal } from "lucide-react";

export interface FilterPanelProps {
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
  /** Active filters for display */
  activeFilters: ActiveFilter[];
  /** Remove single filter */
  onRemoveFilter: (key: string, value: string) => void;
  /** Clear all filters */
  onClearAll: () => void;
  /** Additional CSS classes */
  className?: string;
}

export function FilterPanel({
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
  className,
}: FilterPanelProps) {
  return (
    <aside
      className={cn(
        "hidden lg:block w-80 flex-shrink-0",
        className
      )}
      aria-label="Project filters"
    >
      <div className="sticky top-4 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-2 pb-4 border-b border-gray-200">
          <SlidersHorizontal className="h-5 w-5 text-primary-600" />
          <h2 className="text-lg font-bold text-gray-900">Filters</h2>
        </div>

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
        <div className="space-y-6 pb-6 border-b border-gray-200">
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
    </aside>
  );
}
