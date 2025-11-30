import { cn } from "@/lib/utils";

/**
 * Container Component
 *
 * Responsive width container with proper padding following governmental design standards.
 * Provides consistent horizontal spacing and maximum widths across breakpoints.
 *
 * @example
 * ```tsx
 * <Container>
 *   <h1>Page Content</h1>
 * </Container>
 *
 * <Container size="narrow">
 *   <article>Narrow content for readability</article>
 * </Container>
 * ```
 */

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Container size variant */
  size?: "narrow" | "default" | "wide" | "full";
  /** Additional CSS classes */
  className?: string;
  /** Container content */
  children: React.ReactNode;
}

const containerVariants = {
  narrow: "max-w-4xl",
  default: "max-w-7xl",
  wide: "max-w-[1600px]",
  full: "max-w-full",
};

export function Container({
  size = "default",
  className,
  children,
  ...props
}: ContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-4 sm:px-6 lg:px-8",
        containerVariants[size],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
