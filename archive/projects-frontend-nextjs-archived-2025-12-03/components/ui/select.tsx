import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

/**
 * Select Component
 *
 * Accessible dropdown select with governmental styling.
 * Supports labels, helper text, and error states.
 *
 * @example
 * ```tsx
 * <Select label="Category" options={[
 *   { value: 'all', label: 'All Projects' },
 *   { value: 'infrastructure', label: 'Infrastructure' }
 * ]} />
 *
 * <Select
 *   placeholder="Select status..."
 *   options={statusOptions}
 *   onChange={(e) => setStatus(e.target.value)}
 * />
 * ```
 */

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  /** Select label */
  label?: string;
  /** Helper text below select */
  helperText?: string;
  /** Error message */
  error?: string;
  /** Select options */
  options: SelectOption[];
  /** Placeholder option */
  placeholder?: string;
  /** Additional CSS classes */
  className?: string;
  /** Container class for wrapper */
  containerClassName?: string;
}

export function Select({
  label,
  helperText,
  error,
  options,
  placeholder,
  className,
  containerClassName,
  id,
  required,
  disabled,
  ...props
}: SelectProps) {
  const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;
  const hasError = !!error;

  return (
    <div className={cn("w-full", containerClassName)}>
      {label && (
        <label
          htmlFor={selectId}
          className="mb-2 block text-sm font-medium text-gray-900"
        >
          {label}
          {required && <span className="ml-1 text-red-600" aria-label="required">*</span>}
        </label>
      )}
      <div className="relative">
        <select
          id={selectId}
          disabled={disabled}
          required={required}
          className={cn(
            "w-full appearance-none rounded-lg border-2 px-4 py-2.5 pr-10 text-base transition-colors",
            "focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-1",
            "disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500",
            hasError
              ? "border-red-300 bg-red-50 text-red-900 focus:border-red-600 focus:ring-red-600"
              : "border-gray-300 bg-white text-gray-900 focus:border-blue-600",
            className
          )}
          aria-invalid={hasError}
          aria-describedby={
            hasError ? `${selectId}-error` : helperText ? `${selectId}-helper` : undefined
          }
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
          <ChevronDown size={18} aria-hidden="true" />
        </div>
      </div>
      {error && (
        <p
          id={`${selectId}-error`}
          className="mt-1.5 text-sm text-red-600"
          role="alert"
        >
          {error}
        </p>
      )}
      {!error && helperText && (
        <p id={`${selectId}-helper`} className="mt-1.5 text-sm text-gray-600">
          {helperText}
        </p>
      )}
    </div>
  );
}
