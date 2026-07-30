interface ErrorMessageProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  fullScreen?: boolean;
}

/**
 * Component untuk menampilkan error state dengan optional retry button
 */
export function ErrorMessage({
  title = "Something went wrong",
  message = "An unexpected error occurred. Please try again.",
  onRetry,
  fullScreen = false,
}: ErrorMessageProps) {
  const containerClasses = fullScreen
    ? "min-h-screen flex items-center justify-center bg-gray-50"
    : "flex items-center justify-center p-8";

  return (
    <div className={containerClasses}>
      <div className="text-center max-w-md">
        {/* Error Icon */}
        <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
          <svg
            className="w-8 h-8 text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>

        {/* Message */}
        <p className="text-sm text-gray-600 mb-6">{message}</p>

        {/* Retry Button */}
        {onRetry && (
          <button
            onClick={onRetry}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Try Again
          </button>
        )}
      </div>
    </div>
  );
}
