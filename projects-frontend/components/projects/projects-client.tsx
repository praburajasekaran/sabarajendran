"use client";

/**
 * Projects Client Component
 *
 * Client-side wrapper for the projects page with real-time filtering.
 * Handles all filter state, URL synchronization, and user interactions.
 */

import { useState, useMemo } from "react";
import { SlidersHorizontal } from "lucide-react";
import { FilterPanel } from "./filters/filter-panel";
import { FilterDrawer } from "./filters/filter-drawer";
import { CompactFilterShortcuts } from "./filters/filter-shortcuts";
import { CompactActiveFilters } from "./filters/active-filters";
import { ProjectsList, ResultsCount } from "./projects-list";
import { useProjectFilters, type TaxonomyData } from "@/lib/hooks/use-project-filters";
import type { Project } from "@/lib/wordpress/types";
import { cn } from "@/lib/utils";
import { SIMPLIFIED_STATUS_OPTIONS } from "@/lib/utils/status-mapping";

export interface ProjectsClientProps {
  /** All projects (fetched server-side) */
  projects: Project[];
  /** Taxonomy data */
  taxonomies: TaxonomyData;
}

export function ProjectsClient({ projects, taxonomies }: ProjectsClientProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Use the project filters hook
  const {
    filteredProjects,
    filters,
    searchQuery,
    setFilter,
    setSearch,
    clearFilters,
    clearFilter,
    hasFilters,
    activeFilterCount,
    filterCounts,
    totalResults,
    pagination,
  } = useProjectFilters(projects, taxonomies);

  // Build active filters array for display
  const activeFilters = useMemo(() => {
    const result: Array<{ key: string; label: string; value: string; displayValue: string }> = [];

    // Categories
    if (filters.categories) {
      filters.categories.forEach((slug) => {
        const term = taxonomies.categories.find((c) => c.slug === slug);
        if (term) {
          result.push({
            key: "categories",
            label: "Category",
            value: slug,
            displayValue: term.name,
          });
        }
      });
    }

    // Villages
    if (filters.villages) {
      filters.villages.forEach((slug) => {
        const term = taxonomies.villages.find((v) => v.slug === slug);
        if (term) {
          result.push({
            key: "villages",
            label: "Village",
            value: slug,
            displayValue: term.name,
          });
        }
      });
    }

    // Years
    if (filters.years) {
      filters.years.forEach((slug) => {
        const term = taxonomies.years.find((y) => y.slug === slug);
        if (term) {
          result.push({
            key: "years",
            label: "Year",
            value: slug,
            displayValue: term.name,
          });
        }
      });
    }

    // Statuses (use simplified names)
    if (filters.statuses) {
      filters.statuses.forEach((slug) => {
        const statusOption = SIMPLIFIED_STATUS_OPTIONS.find((s) => s.slug === slug);
        if (statusOption) {
          result.push({
            key: "statuses",
            label: "Status",
            value: slug,
            displayValue: statusOption.name,
          });
        }
      });
    }

    // Search
    if (filters.search) {
      result.push({
        key: "search",
        label: "Search",
        value: filters.search,
        displayValue: `"${filters.search}"`,
      });
    }

    return result;
  }, [filters, taxonomies]);

  // Handle removing a single filter
  const handleRemoveFilter = (key: string, value: string) => {
    if (key === "search") {
      setSearch("");
    } else {
      const current = filters[key as keyof typeof filters];
      if (Array.isArray(current)) {
        setFilter(key as any, current.filter((v) => v !== value));
      }
    }
  };

  // Handle applying filter shortcuts
  const handleApplyShortcut = (shortcutFilters: any) => {
    // Clear existing filters and apply shortcut
    clearFilters();
    Object.entries(shortcutFilters).forEach(([key, value]) => {
      setFilter(key as any, value as any);
    });
    setIsDrawerOpen(false);
  };

  return (
    <div className="flex gap-8">
      {/* Desktop Filter Panel */}
      <FilterPanel
        searchQuery={searchQuery}
        onSearchChange={setSearch}
        categories={taxonomies.categories}
        selectedCategories={filters.categories || []}
        onCategoriesChange={(slugs) => setFilter("categories", slugs)}
        villages={taxonomies.villages}
        selectedVillages={filters.villages || []}
        onVillagesChange={(slugs) => setFilter("villages", slugs)}
        years={taxonomies.years}
        selectedYears={filters.years || []}
        onYearsChange={(slugs) => setFilter("years", slugs)}
        selectedStatuses={filters.statuses || []}
        onStatusesChange={(slugs) => setFilter("statuses", slugs)}
        filterCounts={filterCounts}
        activeFilters={activeFilters}
        onRemoveFilter={handleRemoveFilter}
        onClearAll={clearFilters}
      />

      {/* Mobile Filter Drawer */}
      <FilterDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        searchQuery={searchQuery}
        onSearchChange={setSearch}
        categories={taxonomies.categories}
        selectedCategories={filters.categories || []}
        onCategoriesChange={(slugs) => setFilter("categories", slugs)}
        villages={taxonomies.villages}
        selectedVillages={filters.villages || []}
        onVillagesChange={(slugs) => setFilter("villages", slugs)}
        years={taxonomies.years}
        selectedYears={filters.years || []}
        onYearsChange={(slugs) => setFilter("years", slugs)}
        selectedStatuses={filters.statuses || []}
        onStatusesChange={(slugs) => setFilter("statuses", slugs)}
        filterCounts={filterCounts}
        activeFilters={activeFilters}
        onRemoveFilter={handleRemoveFilter}
        onClearAll={clearFilters}
      />

      {/* Main Content */}
      <div className="flex-1 min-w-0">
        {/* Mobile Header */}
        <div className="lg:hidden mb-6 space-y-4">
          {/* Filter Toggle Button */}
          <button
            type="button"
            onClick={() => setIsDrawerOpen(true)}
            className={cn(
              "flex items-center justify-center gap-2 w-full px-4 py-3",
              "bg-white border-2 border-gray-300 rounded-lg",
              "text-gray-700 font-semibold",
              "transition-all duration-200",
              "hover:border-primary-600 hover:bg-primary-50 hover:text-primary-700",
              activeFilterCount > 0 && "border-primary-600 bg-primary-50 text-primary-700"
            )}
          >
            <SlidersHorizontal className="h-5 w-5" />
            <span>Filters</span>
            {activeFilterCount > 0 && (
              <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 bg-primary-600 text-white text-xs font-bold rounded-full">
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* Quick Filters */}
          <CompactFilterShortcuts onApplyShortcut={handleApplyShortcut} />

          {/* Active Filters Badge */}
          {activeFilterCount > 0 && (
            <CompactActiveFilters count={activeFilterCount} onClearAll={clearFilters} />
          )}
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <ResultsCount
            total={totalResults}
            showing={filteredProjects.length}
            searchQuery={searchQuery}
          />
        </div>

        {/* Projects Grid */}
        <ProjectsList
          projects={filteredProjects}
          searchQuery={searchQuery}
        />

        {/* Pagination */}
        {totalResults > 0 && (
          <div className="mt-12 flex justify-center gap-2">
            <button
              onClick={() => pagination.setPage(pagination.currentPage - 1)}
              disabled={pagination.currentPage === 1}
              className="px-4 py-2 border rounded-md disabled:opacity-50 hover:bg-gray-50 transition-colors"
            >
              Previous
            </button>
            <div className="flex items-center gap-2 px-2">
              <span className="text-sm text-gray-600">
                Page {pagination.currentPage} of {pagination.totalPages}
              </span>
            </div>
            <button
              onClick={() => pagination.setPage(pagination.currentPage + 1)}
              disabled={pagination.currentPage === pagination.totalPages}
              className="px-4 py-2 border rounded-md disabled:opacity-50 hover:bg-gray-50 transition-colors"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
