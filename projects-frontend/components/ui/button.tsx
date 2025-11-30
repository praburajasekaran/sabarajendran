import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

/**
 * Button Component
 *
 * Accessible button with governmental styling and multiple variants.
 * Includes loading states, sizes, and proper focus indicators.
 *
 * @example
 * ```tsx
 * <Button>Default Button</Button>
 * <Button variant="primary" size="lg">Primary Action</Button>
 * <Button variant="outline" loading>Loading...</Button>
 * <Button variant="ghost" icon={<Icon />}>With Icon</Button>
 * ```
 */

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Button style variant */
  variant?: "primary" | "secondary" | "outline" | "ghost" | "link";
  /** Button size */
  size?: "sm" | "md" | "lg" | "xl";
  /** Loading state */
  loading?: boolean;
  /** Icon element */
  icon?: React.ReactNode;
  /** Icon position */
  iconPosition?: "left" | "right";
  /** Full width button */
  fullWidth?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Button content */
  children?: React.ReactNode;
}

const variantStyles = {
  primary:
    "bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 shadow-sm",
  secondary:
    "bg-orange-600 text-white hover:bg-orange-700 active:bg-orange-800 shadow-sm",
  outline:
    "border-2 border-gray-300 bg-white text-gray-900 hover:bg-gray-50 active:bg-gray-100",
  ghost: "bg-transparent text-gray-900 hover:bg-gray-100 active:bg-gray-200",
  link: "bg-transparent text-blue-600 hover:text-blue-800 underline-offset-4 hover:underline",
};

const sizeStyles = {
  sm: "px-3 py-1.5 text-sm rounded-md",
  md: "px-4 py-2 text-base rounded-lg",
  lg: "px-6 py-3 text-lg rounded-lg",
  xl: "px-8 py-4 text-xl rounded-xl",
};

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  icon,
  iconPosition = "left",
  fullWidth = false,
  className,
  disabled,
  children,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600",
        "disabled:cursor-not-allowed disabled:opacity-50",
        variantStyles[variant],
        sizeStyles[size],
        fullWidth && "w-full",
        className
      )}
      disabled={isDisabled}
      {...props}
    >
      {loading && <Loader2 size={16} className="animate-spin" aria-hidden="true" />}
      {!loading && icon && iconPosition === "left" && icon}
      {children}
      {!loading && icon && iconPosition === "right" && icon}
    </button>
  );
}
