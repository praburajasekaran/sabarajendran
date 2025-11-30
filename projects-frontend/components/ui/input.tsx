import { cn } from "@/lib/utils";
import { Search } from "lucide-react";

/**
 * Input Component
 *
 * Accessible form input with governmental styling.
 * Supports various types, icons, and states.
 *
 * @example
 * ```tsx
 * <Input type="text" placeholder="Enter text..." />
 * <Input type="email" label="Email Address" required />
 * <Input type="search" icon={<Search />} placeholder="Search projects..." />
 * ```
 */

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Input label */
  label?: string;
  /** Helper text below input */
  helperText?: string;
  /** Error message */
  error?: string;
  /** Icon element */
  icon?: React.ReactNode;
  /** Icon position */
  iconPosition?: "left" | "right";
  /** Additional CSS classes */
  className?: string;
  /** Container class for wrapper */
  containerClassName?: string;
}

export function Input({
  label,
  helperText,
  error,
  icon,
  iconPosition = "left",
  className,
  containerClassName,
  id,
  required,
  disabled,
  ...props
}: InputProps) {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
  const hasError = !!error;

  return (
    <div className={cn("w-full", containerClassName)}>
      {label && (
        <label
          htmlFor={inputId}
          className="mb-2 block text-sm font-medium text-gray-900"
        >
          {label}
          {required && <span className="ml-1 text-red-600" aria-label="required">*</span>}
        </label>
      )}
      <div className="relative">
        {icon && iconPosition === "left" && (
          <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
            {icon}
          </div>
        )}
        <input
          id={inputId}
          disabled={disabled}
          required={required}
          className={cn(
            "w-full rounded-lg border-2 px-4 py-2.5 text-base transition-colors",
            "placeholder:text-gray-400",
            "focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-1",
            "disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500",
            hasError
              ? "border-red-300 bg-red-50 text-red-900 focus:border-red-600 focus:ring-red-600"
              : "border-gray-300 bg-white text-gray-900 focus:border-blue-600",
            icon && iconPosition === "left" && "pl-10",
            icon && iconPosition === "right" && "pr-10",
            className
          )}
          aria-invalid={hasError}
          aria-describedby={
            hasError ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined
          }
          {...props}
        />
        {icon && iconPosition === "right" && (
          <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
            {icon}
          </div>
        )}
      </div>
      {error && (
        <p
          id={`${inputId}-error`}
          className="mt-1.5 text-sm text-red-600"
          role="alert"
        >
          {error}
        </p>
      )}
      {!error && helperText && (
        <p id={`${inputId}-helper`} className="mt-1.5 text-sm text-gray-600">
          {helperText}
        </p>
      )}
    </div>
  );
}

/**
 * SearchInput Component
 *
 * Specialized input for search functionality with icon.
 *
 * @example
 * ```tsx
 * <SearchInput
 *   placeholder="Search projects..."
 *   onChange={(e) => setQuery(e.target.value)}
 * />
 * ```
 */

export interface SearchInputProps
  extends Omit<InputProps, "type" | "icon" | "iconPosition"> {
  onClear?: () => void;
}

export function SearchInput({ className, ...props }: SearchInputProps) {
  return (
    <Input
      type="search"
      icon={<Search size={18} />}
      iconPosition="left"
      className={className}
      {...props}
    />
  );
}
