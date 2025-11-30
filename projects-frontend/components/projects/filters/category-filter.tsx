"use client";

/**
 * Category Filter Component
 *
 * Multi-select checkbox filter for project categories.
 * Shows item counts and supports keyboard navigation.
 */

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CategoryFilterProps {
  /** Available categories */
  categories: Array<{ id: number; slug: string; name: string; count: number }>;
  /** Selected category slugs */
  selected: string[];
  /** Change handler */
  onChange: (slugs: string[]) => void;
  /** Filter counts based on other active filters */
  filterCounts?: Record<string, number>;
  /** Additional CSS classes */
  className?: string;
}

export function CategoryFilter({
  categories,
  selected,
  onChange,
  filterCounts,
  className,
}: CategoryFilterProps) {
  const handleToggle = (slug: string) => {
    if (selected.includes(slug)) {
      onChange(selected.filter((s) => s !== slug));
    } else {
      onChange([...selected, slug]);
    }
  };

  const handleSelectAll = () => {
    if (selected.length === categories.length) {
      onChange([]);
    } else {
      onChange(categories.map((c) => c.slug));
    }
  };

  if (categories.length === 0) {
    return null;
  }

  return (
    <div className={cn("space-y-3", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900">Category</h3>
        {categories.length > 1 && (
          <button
            type="button"
            onClick={handleSelectAll}
            className="text-xs text-primary-600 hover:text-primary-700 font-medium"
          >
            {selected.length === categories.length ? "Clear" : "Select All"}
          </button>
        )}
      </div>

      {/* Options */}
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {categories.map((category) => {
          const isSelected = selected.includes(category.slug);
          const count = filterCounts?.[category.slug] ?? category.count;
          const isDisabled = count === 0 && !isSelected;

          return (
            <label
              key={category.id}
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
                  onChange={() => handleToggle(category.slug)}
                  disabled={isDisabled}
                  className="sr-only"
                  aria-label={`Filter by ${category.name}`}
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
                  "flex-1 text-sm",
                  isSelected ? "font-medium text-gray-900" : "text-gray-700"
                )}
              >
                {category.name}
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
