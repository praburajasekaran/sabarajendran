import { cn } from "@/lib/utils";
import { CheckCircle2, Clock, Circle } from "lucide-react";

/**
 * Badge Component
 *
 * Status indicators for project states (Completed, Ongoing, Planned).
 * Follows governmental design with clear visual hierarchy and accessibility.
 * Uses both color and icons for WCAG compliance.
 *
 * @example
 * ```tsx
 * <Badge variant="completed">Completed</Badge>
 * <Badge variant="ongoing">In Progress</Badge>
 * <Badge variant="planned" size="lg">Upcoming</Badge>
 * ```
 */

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Badge variant for project status */
  variant?: "completed" | "ongoing" | "planned" | "default";
  /** Badge size */
  size?: "sm" | "md" | "lg";
  /** Show icon */
  showIcon?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Badge content */
  children: React.ReactNode;
}

const variantStyles = {
  completed: "bg-green-100 text-green-800 border-green-200",
  ongoing: "bg-orange-100 text-orange-800 border-orange-200",
  planned: "bg-pink-100 text-pink-800 border-pink-200",
  default: "bg-gray-100 text-gray-800 border-gray-200",
};

const sizeStyles = {
  sm: "px-2 py-0.5 text-xs",
  md: "px-3 py-1 text-sm",
  lg: "px-4 py-1.5 text-base",
};

const iconSizes = {
  sm: 12,
  md: 14,
  lg: 16,
};

const icons = {
  completed: CheckCircle2,
  ongoing: Clock,
  planned: Circle,
  default: Circle,
};

export function Badge({
  variant = "default",
  size = "md",
  showIcon = true,
  className,
  children,
  ...props
}: BadgeProps) {
  const Icon = icons[variant];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border font-medium transition-colors",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {showIcon && <Icon size={iconSizes[size]} aria-hidden="true" />}
      {children}
    </span>
  );
}
