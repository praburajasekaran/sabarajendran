"use client";

/**
 * Active Filters Display Component
 *
 * Shows currently applied filters as removable chips/tags.
 * Provides quick visual feedback and one-click removal.
 */

import { X, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ActiveFilter {
  key: string;
  label: string;
  value: string;
  displayValue: string;
}

export interface ActiveFiltersProps {
  /** Active filters to display */
  filters: ActiveFilter[];
  /** Remove single filter handler */
  onRemove: (key: string, value: string) => void;
  /** Clear all filters handler */
  onClearAll: () => void;
  /** Additional CSS classes */
  className?: string;
}

export function ActiveFilters({
  filters,
  onRemove,
  onClearAll,
  className,
}: ActiveFiltersProps) {
  if (filters.length === 0) {
    return null;
  }

  return (
    <div className={cn("space-y-3", className)} role="region" aria-label="Active filters">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-700">
          Active Filters ({filters.length})
        </h3>
        <button
          type="button"
          onClick={onClearAll}
          className={cn(
            "flex items-center gap-1.5 text-xs font-medium text-primary-600 hover:text-primary-700",
            "transition-colors focus:outline-none focus:underline"
          )}
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Clear All
        </button>
      </div>

      {/* Filter Tags */}
      <div className="flex flex-wrap gap-2">
        {filters.map((filter) => (
          <FilterTag
            key={`${filter.key}-${filter.value}`}
            label={filter.displayValue}
            onRemove={() => onRemove(filter.key, filter.value)}
          />
        ))}
      </div>
    </div>
  );
}

/**
 * Individual Filter Tag Component
 */
interface FilterTagProps {
  label: string;
  onRemove: () => void;
}

function FilterTag({ label, onRemove }: FilterTagProps) {
  return (
    <button
      type="button"
      onClick={onRemove}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full bg-primary-100 px-3 py-1.5",
        "text-sm font-medium text-primary-700",
        "transition-all duration-200",
        "hover:bg-primary-200 hover:text-primary-800",
        "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
      )}
      aria-label={`Remove ${label} filter`}
    >
      <span>{label}</span>
      <X className="h-3.5 w-3.5" strokeWidth={2.5} />
    </button>
  );
}

/**
 * Compact Active Filters Display (for mobile header)
 */
export interface CompactActiveFiltersProps {
  /** Total count of active filters */
  count: number;
  /** Clear all handler */
  onClearAll: () => void;
  /** Additional CSS classes */
  className?: string;
}

export function CompactActiveFilters({
  count,
  onClearAll,
  className,
}: CompactActiveFiltersProps) {
  if (count === 0) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={onClearAll}
      className={cn(
        "inline-flex items-center gap-2 rounded-lg bg-primary-100 px-3 py-1.5",
        "text-sm font-medium text-primary-700",
        "transition-colors hover:bg-primary-200",
        className
      )}
      aria-label={`Clear ${count} active ${count === 1 ? "filter" : "filters"}`}
    >
      <span>{count} {count === 1 ? "filter" : "filters"}</span>
      <X className="h-4 w-4" />
    </button>
  );
}
