import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

/**
 * Icon Component
 *
 * Wrapper for Lucide React icons with consistent sizing and styling.
 * Ensures accessibility and proper governmental design integration.
 *
 * @example
 * ```tsx
 * import { Home } from 'lucide-react';
 *
 * <Icon icon={Home} size="md" />
 * <Icon icon={Search} size="lg" variant="primary" />
 * <Icon icon={CheckCircle} className="text-green-600" />
 * ```
 */

export interface IconProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Lucide icon component */
  icon: LucideIcon;
  /** Icon size */
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  /** Color variant */
  variant?: "default" | "primary" | "secondary" | "muted";
  /** Additional CSS classes */
  className?: string;
  /** Accessible label for screen readers */
  label?: string;
}

const sizeStyles = {
  xs: 14,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
};

const variantStyles = {
  default: "text-gray-900",
  primary: "text-blue-600",
  secondary: "text-orange-600",
  muted: "text-gray-500",
};

export function Icon({
  icon: IconComponent,
  size = "md",
  variant = "default",
  className,
  label,
  ...props
}: IconProps) {
  return (
    <span
      className={cn("inline-flex items-center", variantStyles[variant], className)}
      aria-label={label}
      role={label ? "img" : undefined}
      {...props}
    >
      <IconComponent size={sizeStyles[size]} aria-hidden={!label} />
    </span>
  );
}
