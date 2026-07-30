import { forwardRef, type SelectHTMLAttributes } from "react";

interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options: SelectOption[];
  placeholder?: string;
  fullWidth?: boolean;
}

/**
 * Reusable Select/Dropdown component
 */
export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      error,
      helperText,
      options,
      placeholder = "Select an option",
      fullWidth = true,
      className = "",
      id,
      ...props
    },
    ref,
  ) => {
    const selectId = id || label?.toLowerCase().replace(/\s+/g, "-");

    const baseClasses =
      "block rounded-md border px-3 py-2 text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:bg-gray-100 disabled:cursor-not-allowed";

    const stateClasses = error
      ? "border-red-300 focus:border-red-500 focus:ring-red-500"
      : "border-gray-300 focus:border-blue-500 focus:ring-blue-500";

    const widthClass = fullWidth ? "w-full" : "";

    const combinedClasses = [baseClasses, stateClasses, widthClass, className]
      .filter(Boolean)
      .join(" ");

    return (
      <div className={widthClass}>
        {label && (
          <label htmlFor={selectId} className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          className={combinedClasses}
          aria-invalid={error ? "true" : "false"}
          {...props}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((option) => (
            <option key={option.value} value={option.value} disabled={option.disabled}>
              {option.label}
            </option>
          ))}
        </select>
        {error && (
          <p id={`${selectId}-error`} className="mt-1 text-sm text-red-600">
            {error}
          </p>
        )}
        {helperText && !error && (
          <p id={`${selectId}-helper`} className="mt-1 text-sm text-gray-500">
            {helperText}
          </p>
        )}
      </div>
    );
  },
);

Select.displayName = "Select";
