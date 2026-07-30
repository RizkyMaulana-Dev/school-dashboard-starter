import { Component, type ReactNode, type ErrorInfo } from "react";
import { ErrorMessage } from "@/components/feedback/ErrorMessage";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error("Error caught by boundary:", error, errorInfo);
    // Here you could send error to monitoring service
  }

  handleRetry = (): void => {
    this.setState({ hasError: false, error: undefined });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <ErrorMessage
          title="Aplikasi mengalami kesalahan"
          message={this.state.error?.message || "Terjadi kesalahan yang tidak terduga"}
          onRetry={this.handleRetry}
          fullScreen
        />
      );
    }

    return this.props.children;
  }
}
