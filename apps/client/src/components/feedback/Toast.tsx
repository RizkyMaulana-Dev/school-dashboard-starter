import { useUIStore, type Toast as ToastType } from "@/stores/ui.store";

/**
 * Toast notification component
 * Auto-dismisses based on duration in store
 */
export function ToastContainer() {
  const { toasts, removeToast } = useUIStore();

  if (toasts.length === 0) return null;

  const typeStyles: Record<ToastType["type"], string> = {
    success: "bg-green-50 border-green-500 text-green-800",
    error: "bg-red-50 border-red-500 text-red-800",
    warning: "bg-yellow-50 border-yellow-500 text-yellow-800",
    info: "bg-blue-50 border-blue-500 text-blue-800",
  };

  const typeIcons: Record<ToastType["type"], string> = {
    success: "✓",
    error: "✕",
    warning: "⚠",
    info: "ℹ",
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm w-full">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`border-l-4 rounded-md shadow-lg p-4 animate-slide-in ${typeStyles[toast.type]}`}
        >
          <div className="flex items-start gap-3">
            {/* Icon */}
            <span className="text-lg font-bold flex-shrink-0">{typeIcons[toast.type]}</span>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">{toast.title}</p>
              {toast.message && <p className="text-sm mt-1 opacity-90">{toast.message}</p>}
            </div>

            {/* Close button */}
            <button
              onClick={() => removeToast(toast.id)}
              className="flex-shrink-0 p-1 rounded-md hover:bg-black hover:bg-opacity-10 transition-colors"
              aria-label="Close notification"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
