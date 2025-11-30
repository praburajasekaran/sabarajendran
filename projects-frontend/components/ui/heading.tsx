import { cn } from "@/lib/utils";

/**
 * Heading Component
 *
 * Semantic heading component with governmental styling and proper hierarchy.
 * Ensures WCAG AA compliant contrast and professional typography.
 *
 * @example
 * ```tsx
 * <Heading level={1}>Main Page Title</Heading>
 * <Heading level={2} variant="primary">Section Heading</Heading>
 * <Heading level={3} className="mb-4">Subsection</Heading>
 * ```
 */

export interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  /** Heading level (h1-h6) */
  level: 1 | 2 | 3 | 4 | 5 | 6;
  /** Color variant */
  variant?: "default" | "primary" | "secondary" | "muted";
  /** Text alignment */
  align?: "left" | "center" | "right";
  /** Additional CSS classes */
  className?: string;
  /** Heading content */
  children: React.ReactNode;
}

const levelStyles = {
  1: "text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight",
  2: "text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight",
  3: "text-2xl md:text-3xl lg:text-4xl font-semibold tracking-tight",
  4: "text-xl md:text-2xl lg:text-3xl font-semibold",
  5: "text-lg md:text-xl font-semibold",
  6: "text-base md:text-lg font-semibold",
};

const variantStyles = {
  default: "text-gray-900",
  primary: "text-blue-900",
  secondary: "text-orange-900",
  muted: "text-gray-600",
};

const alignStyles = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};

export function Heading({
  level,
  variant = "default",
  align = "left",
  className,
  children,
  ...props
}: HeadingProps) {
  const Tag = `h${level}` as "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

  return (
    <Tag
      className={cn(
        levelStyles[level],
        variantStyles[variant],
        alignStyles[align],
        className
      )}
      {...props}
    >
      {children}
    </Tag>
  );
}
