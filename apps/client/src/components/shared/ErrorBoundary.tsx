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
    }

    handleRetry = (): void => {
        this.setState({ hasError: false, error: undefined });
    };

    // 🔹 Helper untuk ekstrak pesan bahasa manusia dari Axios / Backend
    getErrorMessage = (): string => {
        const err = this.state.error as any;

        // 1. Cek apakah ada response message dari Backend (Prisma / Express)
        if (err?.response?.data?.message) {
            return err.response.data.message;
        }

        // 2. Jika error JS biasa, tampilkan error.message
        if (this.state.error?.message) {
            return this.state.error.message;
        }

        // 3. Fallback jika tidak ada pesan sama sekali
        return "Terjadi kesalahan yang tidak terduga";
    };

    render(): ReactNode {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <ErrorMessage
                    title="Aplikasi mengalami kesalahan"
                    message={this.getErrorMessage()} // 👈 Panggil helper di sini
                    onRetry={this.handleRetry}
                    fullScreen
                />
            );
        }

        return this.props.children;
    }
}