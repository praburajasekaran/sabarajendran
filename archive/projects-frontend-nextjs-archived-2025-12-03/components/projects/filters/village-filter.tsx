"use client";

/**
 * Village Filter Component
 *
 * Multi-select checkbox filter for villages.
 * Identical to CategoryFilter but styled for villages.
 */

import { Check, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

export interface VillageFilterProps {
  /** Available villages */
  villages: Array<{ id: number; slug: string; name: string; count: number }>;
  /** Selected village slugs */
  selected: string[];
  /** Change handler */
  onChange: (slugs: string[]) => void;
  /** Filter counts based on other active filters */
  filterCounts?: Record<string, number>;
  /** Additional CSS classes */
  className?: string;
}

export function VillageFilter({
  villages,
  selected,
  onChange,
  filterCounts,
  className,
}: VillageFilterProps) {
  const handleToggle = (slug: string) => {
    if (selected.includes(slug)) {
      onChange(selected.filter((s) => s !== slug));
    } else {
      onChange([...selected, slug]);
    }
  };

  const handleSelectAll = () => {
    if (selected.length === villages.length) {
      onChange([]);
    } else {
      onChange(villages.map((v) => v.slug));
    }
  };

  if (villages.length === 0) {
    return null;
  }

  return (
    <div className={cn("space-y-3", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-gray-500" />
          <h3 className="text-sm font-semibold text-gray-900">Village</h3>
        </div>
        {villages.length > 1 && (
          <button
            type="button"
            onClick={handleSelectAll}
            className="text-xs text-primary-600 hover:text-primary-700 font-medium"
          >
            {selected.length === villages.length ? "Clear" : "Select All"}
          </button>
        )}
      </div>

      {/* Options */}
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {villages.map((village) => {
          const isSelected = selected.includes(village.slug);
          const count = filterCounts?.[village.slug] ?? village.count;
          const isDisabled = count === 0 && !isSelected;

          return (
            <label
              key={village.id}
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
                  onChange={() => handleToggle(village.slug)}
                  disabled={isDisabled}
                  className="sr-only"
                  aria-label={`Filter by ${village.name}`}
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
                {village.name}
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
