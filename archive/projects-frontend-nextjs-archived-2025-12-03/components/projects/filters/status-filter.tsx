"use client";

/**
 * Status Filter Component
 *
 * Simplified status filter with only two options: "Completed" and "In Progress".
 * Detailed statuses (e.g., "Corewall Completed", "Earthwork Completed") are shown
 * on project cards, not in filters.
 */

import { Check, CheckCircle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { SIMPLIFIED_STATUS_OPTIONS } from "@/lib/utils/status-mapping";

export interface StatusFilterProps {
  /** Selected status categories (simplified: "completed" or "in-progress") */
  selected: string[];
  /** Change handler */
  onChange: (slugs: string[]) => void;
  /** Filter counts based on other active filters */
  filterCounts?: Record<string, number>;
  /** Additional CSS classes */
  className?: string;
}

const STATUS_ICONS: Record<string, React.ElementType> = {
  completed: CheckCircle,
  "in-progress": Clock,
};

const STATUS_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  completed: {
    bg: "bg-green-50",
    text: "text-green-700",
    border: "border-green-600",
  },
  "in-progress": {
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-600",
  },
};

export function StatusFilter({
  selected,
  onChange,
  filterCounts,
  className,
}: StatusFilterProps) {
  const handleSelect = (slug: string) => {
    if (selected.includes(slug)) {
      onChange([]);
    } else {
      onChange([slug]);
    }
  };

  return (
    <div className={cn("space-y-3", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900">Status</h3>
        {selected.length > 0 && (
          <button
            type="button"
            onClick={() => onChange([])}
            className="text-xs text-primary-600 hover:text-primary-700 font-medium"
          >
            Clear
          </button>
        )}
      </div>

      {/* Options */}
      <div className="space-y-2">
        {SIMPLIFIED_STATUS_OPTIONS.map((status) => {
          const isSelected = selected.includes(status.slug);
          const count = filterCounts?.[status.slug] ?? 0;
          const isDisabled = count === 0 && !isSelected;
          const Icon = STATUS_ICONS[status.slug] || CheckCircle;
          const colors = STATUS_COLORS[status.slug] || STATUS_COLORS.completed;

          return (
            <label
              key={status.slug}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all cursor-pointer border-2",
                isSelected && `${colors.bg} ${colors.border}`,
                !isSelected && "border-gray-200 hover:border-gray-300 hover:bg-gray-50",
                isDisabled && "opacity-50 cursor-not-allowed"
              )}
              title={status.description}
            >
              <div className="relative flex items-center">
                <input
                  type="radio"
                  checked={isSelected}
                  onChange={() => handleSelect(status.slug)}
                  disabled={isDisabled}
                  className="sr-only"
                  name="status-filter"
                  aria-label={`Filter by ${status.name} status`}
                />
                <Icon
                  className={cn(
                    "h-5 w-5",
                    isSelected ? colors.text : "text-gray-400"
                  )}
                />
              </div>

              <span
                className={cn(
                  "flex-1 text-sm",
                  isSelected ? `font-semibold ${colors.text}` : "text-gray-700"
                )}
              >
                {status.name}
              </span>

              <span
                className={cn(
                  "text-xs font-medium",
                  isSelected ? colors.text : "text-gray-500"
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
