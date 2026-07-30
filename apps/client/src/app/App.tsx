import { RouterProvider } from "react-router-dom";
import { AppProviders } from "@/providers/AppProviders";
import { ErrorBoundary } from "@/components/shared/ErrorBoundary";
import { ToastContainer } from "@/components/feedback/Toast";
import { router } from "@/routes";

export function App() {
  return (
    <ErrorBoundary>
      <AppProviders>
        <RouterProvider router={router} />
        <ToastContainer />
      </AppProviders>
    </ErrorBoundary>
  );
}
