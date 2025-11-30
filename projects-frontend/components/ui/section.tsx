import { cn } from "@/lib/utils";

/**
 * Section Component
 *
 * Page sections with consistent vertical spacing following governmental design standards.
 * Provides proper padding and optional background variants for visual hierarchy.
 *
 * @example
 * ```tsx
 * <Section>
 *   <h2>Section Title</h2>
 *   <p>Section content</p>
 * </Section>
 *
 * <Section variant="muted" spacing="compact">
 *   <div>Compact section with muted background</div>
 * </Section>
 * ```
 */

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  /** Background variant */
  variant?: "default" | "muted" | "primary" | "accent";
  /** Vertical spacing size */
  spacing?: "compact" | "default" | "comfortable" | "spacious";
  /** Additional CSS classes */
  className?: string;
  /** Section content */
  children: React.ReactNode;
  /** Semantic HTML element */
  as?: "section" | "div" | "article" | "aside";
}

const sectionVariants = {
  default: "bg-white",
  muted: "bg-gray-50",
  primary: "bg-blue-50",
  accent: "bg-orange-50",
};

const spacingVariants = {
  compact: "py-8 md:py-12",
  default: "py-12 md:py-16",
  comfortable: "py-16 md:py-20",
  spacious: "py-20 md:py-28",
};

export function Section({
  variant = "default",
  spacing = "default",
  className,
  children,
  as: Component = "section",
  ...props
}: SectionProps) {
  return (
    <Component
      className={cn(
        sectionVariants[variant],
        spacingVariants[spacing],
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}
