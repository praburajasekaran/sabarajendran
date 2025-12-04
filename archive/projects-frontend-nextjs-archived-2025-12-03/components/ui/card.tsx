import { cn } from "@/lib/utils";

/**
 * Card Component
 *
 * Versatile card container following governmental design principles.
 * Provides elevation, proper spacing, and interactive states.
 *
 * @example
 * ```tsx
 * <Card>
 *   <CardHeader>
 *     <CardTitle>Project Title</CardTitle>
 *     <CardDescription>Brief description</CardDescription>
 *   </CardHeader>
 *   <CardContent>
 *     Main content here
 *   </CardContent>
 *   <CardFooter>
 *     <Button>Action</Button>
 *   </CardFooter>
 * </Card>
 * ```
 */

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Card elevation variant */
  variant?: "flat" | "elevated" | "outlined";
  /** Interactive hover effect */
  hoverable?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Card content */
  children: React.ReactNode;
}

const variantStyles = {
  flat: "bg-white",
  elevated: "bg-white shadow-md hover:shadow-lg",
  outlined: "bg-white border-2 border-gray-200",
};

export function Card({
  variant = "elevated",
  hoverable = false,
  className,
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        "rounded-lg transition-all duration-200",
        variantStyles[variant],
        hoverable && "cursor-pointer hover:-translate-y-1",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  children: React.ReactNode;
}

export function CardHeader({ className, children, ...props }: CardHeaderProps) {
  return (
    <div className={cn("p-6 pb-4", className)} {...props}>
      {children}
    </div>
  );
}

export interface CardTitleProps
  extends React.HTMLAttributes<HTMLHeadingElement> {
  className?: string;
  children: React.ReactNode;
}

export function CardTitle({ className, children, ...props }: CardTitleProps) {
  return (
    <h3
      className={cn("text-xl font-semibold text-gray-900", className)}
      {...props}
    >
      {children}
    </h3>
  );
}

export interface CardDescriptionProps
  extends React.HTMLAttributes<HTMLParagraphElement> {
  className?: string;
  children: React.ReactNode;
}

export function CardDescription({
  className,
  children,
  ...props
}: CardDescriptionProps) {
  return (
    <p
      className={cn("mt-2 text-sm text-gray-600", className)}
      {...props}
    >
      {children}
    </p>
  );
}

export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  children: React.ReactNode;
}

export function CardContent({ className, children, ...props }: CardContentProps) {
  return (
    <div className={cn("px-6 py-4", className)} {...props}>
      {children}
    </div>
  );
}

export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  children: React.ReactNode;
}

export function CardFooter({ className, children, ...props }: CardFooterProps) {
  return (
    <div className={cn("flex items-center gap-4 p-6 pt-4", className)} {...props}>
      {children}
    </div>
  );
}
