import { cn } from "@/lib/utils";

/**
 * Text Component
 *
 * Flexible text component with governmental styling variants.
 * Supports multiple sizes and semantic variants for proper hierarchy.
 *
 * @example
 * ```tsx
 * <Text>Regular body text</Text>
 * <Text variant="lead">Larger lead paragraph</Text>
 * <Text variant="small" muted>Helper text or captions</Text>
 * <Text as="span" className="font-semibold">Inline text</Text>
 * ```
 */

export interface TextProps extends React.HTMLAttributes<HTMLElement> {
  /** Text size variant */
  variant?: "lead" | "body" | "small" | "xs";
  /** Muted color for secondary text */
  muted?: boolean;
  /** Text alignment */
  align?: "left" | "center" | "right" | "justify";
  /** Semantic HTML element */
  as?: "p" | "span" | "div" | "label";
  /** Additional CSS classes */
  className?: string;
  /** Text content */
  children: React.ReactNode;
}

const variantStyles = {
  lead: "text-lg md:text-xl leading-relaxed",
  body: "text-base leading-relaxed",
  small: "text-sm leading-relaxed",
  xs: "text-xs leading-relaxed",
};

const alignStyles = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
  justify: "text-justify",
};

export function Text({
  variant = "body",
  muted = false,
  align = "left",
  as: Component = "p",
  className,
  children,
  ...props
}: TextProps) {
  return (
    <Component
      className={cn(
        variantStyles[variant],
        alignStyles[align],
        muted ? "text-gray-600" : "text-gray-900",
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}
