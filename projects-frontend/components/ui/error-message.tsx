import { cn } from "@/lib/utils";
import { AlertCircle, AlertTriangle, Info, XCircle } from "lucide-react";

/**
 * ErrorMessage Component
 *
 * User-friendly error display with governmental styling.
 * Supports multiple severity levels and actions.
 *
 * @example
 * ```tsx
 * <ErrorMessage title="Error loading projects" />
 *
 * <ErrorMessage
 *   severity="warning"
 *   title="Network issue"
 *   message="Please check your connection"
 *   action={<Button onClick={retry}>Retry</Button>}
 * />
 * ```
 */

export interface ErrorMessageProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Error severity level */
  severity?: "error" | "warning" | "info";
  /** Error title */
  title: string;
  /** Detailed error message */
  message?: string;
  /** Action button or element */
  action?: React.ReactNode;
  /** Additional CSS classes */
  className?: string;
}

const severityStyles = {
  error: {
    container: "bg-red-50 border-red-200 text-red-900",
    icon: "text-red-600",
    Icon: XCircle,
  },
  warning: {
    container: "bg-orange-50 border-orange-200 text-orange-900",
    icon: "text-orange-600",
    Icon: AlertTriangle,
  },
  info: {
    container: "bg-blue-50 border-blue-200 text-blue-900",
    icon: "text-blue-600",
    Icon: Info,
  },
};

export function ErrorMessage({
  severity = "error",
  title,
  message,
  action,
  className,
  ...props
}: ErrorMessageProps) {
  const { container, icon, Icon } = severityStyles[severity];

  return (
    <div
      className={cn(
        "flex gap-4 rounded-lg border-2 p-4",
        container,
        className
      )}
      role="alert"
      aria-live="assertive"
      {...props}
    >
      <div className={cn("mt-0.5", icon)}>
        <Icon size={24} aria-hidden="true" />
      </div>
      <div className="flex-1">
        <h3 className="font-semibold">{title}</h3>
        {message && <p className="mt-1 text-sm opacity-90">{message}</p>}
        {action && <div className="mt-3">{action}</div>}
      </div>
    </div>
  );
}

/**
 * InlineError Component
 *
 * Compact inline error message for form fields.
 *
 * @example
 * ```tsx
 * <InlineError>This field is required</InlineError>
 * ```
 */

export interface InlineErrorProps
  extends React.HTMLAttributes<HTMLParagraphElement> {
  className?: string;
  children: React.ReactNode;
}

export function InlineError({
  className,
  children,
  ...props
}: InlineErrorProps) {
  return (
    <p
      className={cn("flex items-center gap-1.5 text-sm text-red-600", className)}
      role="alert"
      {...props}
    >
      <AlertCircle size={14} aria-hidden="true" />
      {children}
    </p>
  );
}
