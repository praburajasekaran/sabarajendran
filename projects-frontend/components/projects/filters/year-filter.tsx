"use client";

/**
 * Year Filter Component
 *
 * Multi-select filter for project years with special sorting.
 */

import { Check, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

export interface YearFilterProps {
  /** Available years */
  years: Array<{ id: number; slug: string; name: string; count: number }>;
  /** Selected year slugs */
  selected: string[];
  /** Change handler */
  onChange: (slugs: string[]) => void;
  /** Filter counts based on other active filters */
  filterCounts?: Record<string, number>;
  /** Additional CSS classes */
  className?: string;
}

export function YearFilter({
  years,
  selected,
  onChange,
  filterCounts,
  className,
}: YearFilterProps) {
  const handleToggle = (slug: string) => {
    if (selected.includes(slug)) {
      onChange(selected.filter((s) => s !== slug));
    } else {
      onChange([...selected, slug]);
    }
  };

  const handleSelectAll = () => {
    if (selected.length === years.length) {
      onChange([]);
    } else {
      onChange(years.map((y) => y.slug));
    }
  };

  if (years.length === 0) {
    return null;
  }

  // Sort years in descending order (most recent first)
  const sortedYears = [...years].sort((a, b) => {
    const yearA = parseInt(a.name);
    const yearB = parseInt(b.name);
    if (isNaN(yearA) || isNaN(yearB)) return a.name.localeCompare(b.name);
    return yearB - yearA;
  });

  return (
    <div className={cn("space-y-3", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-gray-500" />
          <h3 className="text-sm font-semibold text-gray-900">Year</h3>
        </div>
        {years.length > 1 && (
          <button
            type="button"
            onClick={handleSelectAll}
            className="text-xs text-primary-600 hover:text-primary-700 font-medium"
          >
            {selected.length === years.length ? "Clear" : "Select All"}
          </button>
        )}
      </div>

      {/* Options */}
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {sortedYears.map((year) => {
          const isSelected = selected.includes(year.slug);
          const count = filterCounts?.[year.slug] ?? year.count;
          const isDisabled = count === 0 && !isSelected;

          return (
            <label
              key={year.id}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 transition-colors cursor-pointer",
                isSelected && "bg-primary-50",
                !isSelected && !isDisabled && "hover:bg-gray-50",
                isDisabled && "opacity-50 cursor-not-allowed"
              )}
            >
              <div className="relative flex items-center">
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => handleToggle(year.slug)}
                  disabled={isDisabled}
                  className="sr-only"
                  aria-label={`Filter by year ${year.name}`}
                />
                <div
                  className={cn(
                    "flex h-5 w-5 items-center justify-center rounded border-2 transition-all",
                    isSelected
                      ? "border-primary-600 bg-primary-600"
                      : "border-gray-300 bg-white"
                  )}
                >
                  {isSelected && <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />}
                </div>
              </div>

              <span
                className={cn(
                  "flex-1 text-sm font-mono",
                  isSelected ? "font-semibold text-gray-900" : "font-medium text-gray-700"
                )}
              >
                {year.name}
              </span>

              <span
                className={cn(
                  "text-xs font-medium",
                  isSelected ? "text-primary-700" : "text-gray-500"
                )}
              >
                {count}
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
}
