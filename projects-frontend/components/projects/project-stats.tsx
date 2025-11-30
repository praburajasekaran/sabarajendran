import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";

/**
 * ProjectStats Component
 *
 * Statistics display for project overview and metrics.
 * Follows governmental design with clear data presentation.
 *
 * @example
 * ```tsx
 * <ProjectStats stats={[
 *   { label: 'Total Projects', value: '156', icon: Folder },
 *   { label: 'Completed', value: '89', icon: CheckCircle, variant: 'success' },
 *   { label: 'Budget Allocated', value: '₹50 Cr', icon: IndianRupee }
 * ]} />
 * ```
 */

export interface StatItem {
  /** Stat label */
  label: string;
  /** Stat value */
  value: string | number;
  /** Icon component */
  icon?: LucideIcon;
  /** Color variant */
  variant?: "default" | "primary" | "success" | "warning";
  /** Change indicator (optional) */
  change?: {
    value: string;
    trend: "up" | "down" | "neutral";
  };
}

export interface ProjectStatsProps {
  /** Array of stat items */
  stats: StatItem[];
  /** Additional CSS classes */
  className?: string;
}

const variantStyles = {
  default: {
    bg: "bg-gray-50",
    icon: "text-gray-600",
    text: "text-gray-900",
  },
  primary: {
    bg: "bg-blue-50",
    icon: "text-blue-600",
    text: "text-blue-900",
  },
  success: {
    bg: "bg-green-50",
    icon: "text-green-600",
    text: "text-green-900",
  },
  warning: {
    bg: "bg-orange-50",
    icon: "text-orange-600",
    text: "text-orange-900",
  },
};

export function ProjectStats({ stats, className }: ProjectStatsProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4",
        className
      )}
    >
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
}

interface StatCardProps extends StatItem {
  className?: string;
}

function StatCard({
  label,
  value,
  icon: Icon,
  variant = "default",
  change,
  className,
}: StatCardProps) {
  const styles = variantStyles[variant];

  return (
    <Card variant="outlined" className={cn("p-6", className)}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600">{label}</p>
          <p className={cn("mt-2 text-3xl font-bold", styles.text)}>{value}</p>
          {change && (
            <p
              className={cn(
                "mt-2 text-sm font-medium",
                change.trend === "up" && "text-green-600",
                change.trend === "down" && "text-red-600",
                change.trend === "neutral" && "text-gray-600"
              )}
            >
              {change.value}
            </p>
          )}
        </div>
        {Icon && (
          <div className={cn("rounded-lg p-3", styles.bg)}>
            <Icon size={24} className={styles.icon} aria-hidden="true" />
          </div>
        )}
      </div>
    </Card>
  );
}
