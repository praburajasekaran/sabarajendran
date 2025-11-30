"use client";

/**
 * Search Filter Component
 *
 * Real-time search input with debouncing for optimal performance.
 * Includes keyboard shortcuts and clear button.
 *
 * WHY: Constituents need fast, responsive search without overwhelming the system.
 * Debouncing prevents excessive re-renders while typing.
 */

import { useState, useEffect, useCallback, useRef } from "react";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SearchFilterProps {
  /** Current search value */
  value: string;
  /** Change handler */
  onChange: (value: string) => void;
  /** Placeholder text */
  placeholder?: string;
  /** Debounce delay in milliseconds */
  debounce?: number;
  /** Additional CSS classes */
  className?: string;
}

export function SearchFilter({
  value,
  onChange,
  placeholder = "Search projects...",
  debounce = 300,
  className,
}: SearchFilterProps) {
  const [localValue, setLocalValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceTimeout = useRef<NodeJS.Timeout | undefined>(undefined);

  // Update local value when prop changes
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  // Debounced onChange
  const debouncedOnChange = useCallback(
    (newValue: string) => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }

      debounceTimeout.current = setTimeout(() => {
        onChange(newValue);
      }, debounce);
    },
    [onChange, debounce]
  );

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    debouncedOnChange(newValue);
  };

  // Handle clear
  const handleClear = () => {
    setLocalValue("");
    onChange("");
    inputRef.current?.focus();
  };

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // "/" to focus search (like GitHub, Twitter)
      if (e.key === "/" && document.activeElement !== inputRef.current) {
        e.preventDefault();
        inputRef.current?.focus();
      }

      // Escape to clear
      if (e.key === "Escape" && document.activeElement === inputRef.current) {
        handleClear();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className={cn("relative", className)}>
      {/* Search Icon */}
      <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
        <Search className="h-5 w-5" aria-hidden="true" />
      </div>

      {/* Input Field */}
      <input
        ref={inputRef}
        type="search"
        value={localValue}
        onChange={handleChange}
        placeholder={placeholder}
        className={cn(
          "w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-10 text-gray-900 placeholder-gray-500",
          "transition-all duration-200",
          "focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20",
          "hover:border-gray-400"
        )}
        aria-label="Search projects"
        autoComplete="off"
      />

      {/* Clear Button */}
      {localValue && (
        <button
          type="button"
          onClick={handleClear}
          className={cn(
            "absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition-colors",
            "hover:text-gray-600 focus:outline-none focus:text-gray-600"
          )}
          aria-label="Clear search"
        >
          <X className="h-5 w-5" />
        </button>
      )}

      {/* Keyboard Hint */}
      {!localValue && (
        <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 hidden lg:flex items-center gap-1 text-xs text-gray-400">
          <kbd className="rounded border border-gray-300 bg-gray-50 px-1.5 py-0.5 font-mono">
            /
          </kbd>
        </div>
      )}
    </div>
  );
}
