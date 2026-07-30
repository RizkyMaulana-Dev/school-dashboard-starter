import { forwardRef, type InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
}

/**
 * Reusable Input component dengan label dan error state
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, fullWidth = true, className = "", id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

    const baseInputClasses =
      "block rounded-md border px-3 py-2 text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1";

    const stateClasses = error
      ? "border-red-300 focus:border-red-500 focus:ring-red-500"
      : "border-gray-300 focus:border-blue-500 focus:ring-blue-500";

    const widthClass = fullWidth ? "w-full" : "";

    const combinedClasses = [baseInputClasses, stateClasses, widthClass, className]
      .filter(Boolean)
      .join(" ");

    return (
      <div className={widthClass}>
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={combinedClasses}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={
            error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined
          }
          {...props}
        />
        {error && (
          <p id={`${inputId}-error`} className="mt-1 text-sm text-red-600">
            {error}
          </p>
        )}
        {helperText && !error && (
          <p id={`${inputId}-helper`} className="mt-1 text-sm text-gray-500">
            {helperText}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";
