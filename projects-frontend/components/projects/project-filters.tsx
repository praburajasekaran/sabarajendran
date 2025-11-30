"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Select, SelectOption } from "@/components/ui/select";
import { X } from "lucide-react";

/**
 * ProjectFilters Component
 *
 * Filter controls for project listing with category and status filters.
 * Follows governmental design with clear visual hierarchy.
 *
 * @example
 * ```tsx
 * <ProjectFilters
 *   categories={categoryOptions}
 *   onCategoryChange={(value) => setCategory(value)}
 *   onStatusChange={(value) => setStatus(value)}
 *   onReset={clearFilters}
 * />
 * ```
 */

export interface ProjectFiltersProps {
  /** Category filter options */
  categories?: SelectOption[];
  /** Selected category */
  selectedCategory?: string;
  /** Category change handler */
  onCategoryChange?: (category: string) => void;
  /** Selected status */
  selectedStatus?: string;
  /** Status change handler */
  onStatusChange?: (status: string) => void;
  /** Reset filters handler */
  onReset?: () => void;
  /** Show active filters count */
  activeFiltersCount?: number;
  /** Additional CSS classes */
  className?: string;
}

const statusOptions: SelectOption[] = [
  { value: "all", label: "All Status" },
  { value: "completed", label: "Completed" },
  { value: "ongoing", label: "Ongoing" },
  { value: "planned", label: "Planned" },
];

export function ProjectFilters({
  categories,
  selectedCategory = "all",
  onCategoryChange,
  selectedStatus = "all",
  onStatusChange,
  onReset,
  activeFiltersCount = 0,
  className,
}: ProjectFiltersProps) {
  const hasActiveFilters = activeFiltersCount > 0;

  return (
    <div className={cn("flex flex-col gap-4 sm:flex-row sm:items-end", className)}>
      {/* Category Filter */}
      {categories && categories.length > 0 && (
        <div className="flex-1">
          <Select
            label="Category"
            options={categories}
            value={selectedCategory}
            onChange={(e) => onCategoryChange?.(e.target.value)}
            placeholder="All Categories"
            className="min-w-[200px]"
          />
        </div>
      )}

      {/* Status Filter */}
      <div className="flex-1">
        <Select
          label="Status"
          options={statusOptions}
          value={selectedStatus}
          onChange={(e) => onStatusChange?.(e.target.value)}
          placeholder="All Status"
          className="min-w-[200px]"
        />
      </div>

      {/* Reset Filters */}
      {hasActiveFilters && onReset && (
        <div>
          <Button
            variant="outline"
            onClick={onReset}
            icon={<X size={16} />}
            className="w-full sm:w-auto"
          >
            Clear Filters ({activeFiltersCount})
          </Button>
        </div>
      )}
    </div>
  );
}

/**
 * FilterButton Component
 *
 * Toggle button for quick filters (active/inactive states).
 *
 * @example
 * ```tsx
 * <FilterButton active={isActive} onClick={() => setFilter('infrastructure')}>
 *   Infrastructure
 * </FilterButton>
 * ```
 */

export interface FilterButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Active state */
  active?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Button content */
  children: React.ReactNode;
}

export function FilterButton({
  active = false,
  className,
  children,
  ...props
}: FilterButtonProps) {
  return (
    <button
      type="button"
      className={cn(
        "inline-flex items-center gap-2 rounded-lg border-2 px-4 py-2 text-sm font-semibold transition-all duration-200",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600",
        active
          ? "border-blue-600 bg-blue-600 text-white shadow-sm hover:bg-blue-700"
          : "border-gray-300 bg-white text-gray-900 hover:border-blue-600 hover:bg-blue-50 hover:text-blue-600",
        className
      )}
      aria-pressed={active}
      {...props}
    >
      {children}
    </button>
  );
}
