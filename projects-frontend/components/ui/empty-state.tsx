import { cn } from "@/lib/utils";
import { FileQuestion, Search, Inbox } from "lucide-react";

/**
 * EmptyState Component
 *
 * User-friendly empty state display for no results or empty lists.
 * Follows governmental design with clear guidance.
 *
 * @example
 * ```tsx
 * <EmptyState
 *   icon={<Search />}
 *   title="No projects found"
 *   message="Try adjusting your search criteria"
 * />
 *
 * <EmptyState
 *   variant="search"
 *   title="No matching results"
 *   action={<Button onClick={clearFilters}>Clear Filters</Button>}
 * />
 * ```
 */

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Empty state variant with preset icon */
  variant?: "default" | "search" | "empty" | "custom";
  /** Custom icon element */
  icon?: React.ReactNode;
  /** Title text */
  title: string;
  /** Descriptive message */
  message?: string;
  /** Action button or element */
  action?: React.ReactNode;
  /** Additional CSS classes */
  className?: string;
}

const variantIcons = {
  default: Inbox,
  search: Search,
  empty: FileQuestion,
  custom: null,
};

export function EmptyState({
  variant = "default",
  icon,
  title,
  message,
  action,
  className,
  ...props
}: EmptyStateProps) {
  const Icon = icon ? null : variantIcons[variant];

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 px-6 py-12 text-center",
        className
      )}
      role="status"
      aria-live="polite"
      {...props}
    >
      <div className="mb-4 text-gray-400">
        {icon || (Icon && <Icon size={48} aria-hidden="true" />)}
      </div>
      <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
      {message && <p className="mt-2 max-w-md text-sm text-gray-600">{message}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
