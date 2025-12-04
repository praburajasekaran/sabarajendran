import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

/**
 * LoadingSpinner Component
 *
 * Accessible loading indicator with governmental styling.
 * Includes proper ARIA labels for screen readers.
 *
 * @example
 * ```tsx
 * <LoadingSpinner />
 * <LoadingSpinner size="lg" label="Loading projects..." />
 * <LoadingSpinner variant="primary" fullScreen />
 * ```
 */

export interface LoadingSpinnerProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Spinner size */
  size?: "sm" | "md" | "lg" | "xl";
  /** Color variant */
  variant?: "default" | "primary" | "secondary";
  /** Loading message */
  label?: string;
  /** Full screen overlay */
  fullScreen?: boolean;
  /** Additional CSS classes */
  className?: string;
}

const sizeStyles = {
  sm: 16,
  md: 24,
  lg: 32,
  xl: 48,
};

const variantStyles = {
  default: "text-gray-600",
  primary: "text-blue-600",
  secondary: "text-orange-600",
};

export function LoadingSpinner({
  size = "md",
  variant = "primary",
  label = "Loading...",
  fullScreen = false,
  className,
  ...props
}: LoadingSpinnerProps) {
  const spinner = (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3",
        fullScreen ? "fixed inset-0 z-50 bg-white/80 backdrop-blur-sm" : "",
        className
      )}
      role="status"
      aria-live="polite"
      aria-label={label}
      {...props}
    >
      <Loader2
        size={sizeStyles[size]}
        className={cn("animate-spin", variantStyles[variant])}
        aria-hidden="true"
      />
      {label && (
        <span className={cn("text-sm font-medium", variantStyles[variant])}>
          {label}
        </span>
      )}
    </div>
  );

  return spinner;
}

/**
 * LoadingSkeleton Component
 *
 * Skeleton loader for better perceived performance.
 *
 * @example
 * ```tsx
 * <LoadingSkeleton className="h-64 w-full" />
 * <LoadingSkeleton variant="text" count={3} />
 * ```
 */

export interface LoadingSkeletonProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Skeleton variant */
  variant?: "default" | "text" | "circular";
  /** Number of skeleton items */
  count?: number;
  /** Additional CSS classes */
  className?: string;
}

export function LoadingSkeleton({
  variant = "default",
  count = 1,
  className,
  ...props
}: LoadingSkeletonProps) {
  const skeletonClass = cn(
    "animate-pulse bg-gray-200",
    variant === "text" && "h-4 rounded",
    variant === "circular" && "rounded-full",
    variant === "default" && "rounded-lg",
    className
  );

  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className={skeletonClass}
          role="status"
          aria-label="Loading content"
          {...props}
        />
      ))}
    </>
  );
}
