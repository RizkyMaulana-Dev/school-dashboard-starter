import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "danger" | "ghost" | "outline";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
}

/**
 * Reusable Button component dengan berbagai variant dan size
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      children,
      disabled,
      className = "",
      ...props
    },
    ref,
  ) => {
    // Base classes
    const baseClasses =
      "inline-flex items-center justify-center font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

    // Variant classes (placeholder - akan diisi dengan Tailwind atau CSS modules)
    const variantClasses: Record<ButtonVariant, string> = {
      primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
      secondary: "bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500",
      danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
      ghost: "bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-500",
      outline: "border-2 border-blue-600 text-blue-600 hover:bg-blue-50 focus:ring-blue-500",
    };

    // Size classes
    const sizeClasses: Record<ButtonSize, string> = {
      sm: "px-3 py-1.5 text-sm gap-1.5",
      md: "px-4 py-2 text-base gap-2",
      lg: "px-6 py-3 text-lg gap-2.5",
    };

    // Width class
    const widthClass = fullWidth ? "w-full" : "";

    // Combined classes
    const combinedClasses = [
      baseClasses,
      variantClasses[variant],
      sizeClasses[size],
      widthClass,
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <button ref={ref} className={combinedClasses} disabled={disabled || isLoading} {...props}>
        {isLoading ? (
          <>
            <svg
              className="animate-spin h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            Loading...
          </>
        ) : (
          <>
            {leftIcon && <span className="shrink-0">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="shrink-0">{rightIcon}</span>}
          </>
        )}
      </button>
    );
  },
);

Button.displayName = "Button";
