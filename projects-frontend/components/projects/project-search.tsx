"use client";

import { SearchInput } from "@/components/ui/input";
import { useState } from "react";
import { cn } from "@/lib/utils";

/**
 * ProjectSearch Component
 *
 * Search functionality for filtering projects by title or description.
 * Includes debouncing for performance.
 *
 * @example
 * ```tsx
 * <ProjectSearch
 *   onSearch={(query) => filterProjects(query)}
 *   placeholder="Search by project name..."
 * />
 * ```
 */

export interface ProjectSearchProps {
  /** Search query handler */
  onSearch?: (query: string) => void;
  /** Initial search value */
  defaultValue?: string;
  /** Placeholder text */
  placeholder?: string;
  /** Debounce delay in ms */
  debounceMs?: number;
  /** Additional CSS classes */
  className?: string;
}

export function ProjectSearch({
  onSearch,
  defaultValue = "",
  placeholder = "Search projects...",
  debounceMs = 300,
  className,
}: ProjectSearchProps) {
  const [query, setQuery] = useState(defaultValue);

  // Debounced search handler
  const handleSearch = (value: string) => {
    setQuery(value);

    if (onSearch) {
      // Clear existing timeout
      const timeoutId = setTimeout(() => {
        onSearch(value);
      }, debounceMs);

      return () => clearTimeout(timeoutId);
    }
  };

  return (
    <div className={cn("w-full", className)}>
      <SearchInput
        placeholder={placeholder}
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        aria-label="Search projects"
      />
    </div>
  );
}
