import { cn } from "@/lib/utils";

/**
 * Grid Component
 *
 * Flexible responsive grid system for project cards and content layout.
 * Follows governmental design principles with proper spacing and alignment.
 *
 * @example
 * ```tsx
 * <Grid>
 *   <Card>Item 1</Card>
 *   <Card>Item 2</Card>
 *   <Card>Item 3</Card>
 * </Grid>
 *
 * <Grid cols={4} gap="lg">
 *   {items.map(item => <Card key={item.id}>{item.title}</Card>)}
 * </Grid>
 * ```
 */

export interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Number of columns (responsive by default) */
  cols?: 1 | 2 | 3 | 4 | "auto";
  /** Gap spacing between items */
  gap?: "sm" | "md" | "lg" | "xl";
  /** Additional CSS classes */
  className?: string;
  /** Grid items */
  children: React.ReactNode;
}

const colVariants = {
  1: "grid-cols-1",
  2: "grid-cols-1 md:grid-cols-2",
  3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
  auto: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4",
};

const gapVariants = {
  sm: "gap-4",
  md: "gap-6",
  lg: "gap-8",
  xl: "gap-10",
};

export function Grid({
  cols = "auto",
  gap = "lg",
  className,
  children,
  ...props
}: GridProps) {
  return (
    <div
      className={cn("grid", colVariants[cols], gapVariants[gap], className)}
      {...props}
    >
      {children}
    </div>
  );
}
