"use client";

/**
 * Filter Shortcuts Component
 *
 * Quick filter buttons for common filter combinations.
 * Provides one-click access to popular filter views.
 */

import { Zap, CheckCircle, Clock, Calendar, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FilterShortcut {
  id: string;
  label: string;
  icon: React.ElementType;
  filters: {
    categories?: string[];
    villages?: string[];
    years?: string[];
    statuses?: string[];
    schemes?: string[];
  };
}

export interface FilterShortcutsProps {
  /** Available shortcuts */
  shortcuts?: FilterShortcut[];
  /** Apply shortcut handler */
  onApplyShortcut: (filters: FilterShortcut["filters"]) => void;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Default shortcuts for common filter scenarios
 */
const DEFAULT_SHORTCUTS: FilterShortcut[] = [
  {
    id: "completed",
    label: "Completed Projects",
    icon: CheckCircle,
    filters: { statuses: ["completed"] },
  },
  {
    id: "ongoing",
    label: "Ongoing Projects",
    icon: Clock,
    filters: { statuses: ["ongoing"] },
  },
  {
    id: "recent",
    label: "Recent Projects",
    icon: TrendingUp,
    filters: { years: [new Date().getFullYear().toString()] },
  },
  {
    id: "planned",
    label: "Upcoming Projects",
    icon: Calendar,
    filters: { statuses: ["planned"] },
  },
];

export function FilterShortcuts({
  shortcuts = DEFAULT_SHORTCUTS,
  onApplyShortcut,
  className,
}: FilterShortcutsProps) {
  if (shortcuts.length === 0) {
    return null;
  }

  return (
    <div className={cn("space-y-3", className)}>
      {/* Header */}
      <div className="flex items-center gap-2">
        <Zap className="h-4 w-4 text-primary-600" />
        <h3 className="text-sm font-semibold text-gray-900">Quick Filters</h3>
      </div>

      {/* Shortcut Buttons */}
      <div className="grid grid-cols-2 gap-2">
        {shortcuts.map((shortcut) => {
          const Icon = shortcut.icon;
          return (
            <button
              key={shortcut.id}
              type="button"
              onClick={() => onApplyShortcut(shortcut.filters)}
              className={cn(
                "flex items-center gap-2 px-3 py-2.5 rounded-lg border-2 border-gray-200",
                "text-sm font-medium text-gray-700",
                "transition-all duration-200",
                "hover:border-primary-600 hover:bg-primary-50 hover:text-primary-700",
                "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              )}
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              <span className="text-left">{shortcut.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/**
 * Compact shortcuts for mobile header
 */
export interface CompactFilterShortcutsProps {
  /** Available shortcuts */
  shortcuts?: FilterShortcut[];
  /** Apply shortcut handler */
  onApplyShortcut: (filters: FilterShortcut["filters"]) => void;
  /** Additional CSS classes */
  className?: string;
}

export function CompactFilterShortcuts({
  shortcuts = DEFAULT_SHORTCUTS,
  onApplyShortcut,
  className,
}: CompactFilterShortcutsProps) {
  if (shortcuts.length === 0) {
    return null;
  }

  return (
    <div className={cn("flex gap-2 overflow-x-auto pb-2 -mb-2", className)}>
      {shortcuts.map((shortcut) => {
        const Icon = shortcut.icon;
        return (
          <button
            key={shortcut.id}
            type="button"
            onClick={() => onApplyShortcut(shortcut.filters)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-full",
              "bg-white border border-gray-300",
              "text-xs font-medium text-gray-700 whitespace-nowrap",
              "transition-all duration-200",
              "hover:border-primary-600 hover:bg-primary-50 hover:text-primary-700",
              "active:scale-95"
            )}
          >
            <Icon className="h-3.5 w-3.5" />
            <span>{shortcut.label}</span>
          </button>
        );
      })}
    </div>
  );
}
