import React, { Component, ErrorInfo, ReactNode } from 'react';
import { useRouteError, isRouteErrorResponse } from 'react-router-dom';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} />;
    }

    return this.props.children;
  }
}

// Error fallback component for route errors
export const ErrorFallback: React.FC<{ error?: Error | null }> = ({ error }) => {
  const routeError = useRouteError();

  let errorMessage = 'Une erreur est survenue';
  let errorDetails = '';

  if (isRouteErrorResponse(routeError)) {
    errorMessage = `Error ${routeError.status}: ${routeError.statusText}`;
    errorDetails = routeError.data?.message || '';
  } else if (routeError instanceof Error) {
    errorMessage = routeError.message;
    errorDetails = routeError.stack || '';
  } else if (error) {
    errorMessage = error.message;
    errorDetails = error.stack || '';
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="text-center max-w-md mx-auto p-6">
        <h1 className="text-4xl font-bold text-[#C40505] mb-4">Oops!</h1>
        <h2 className="text-2xl font-semibold mb-4 text-white">{errorMessage}</h2>
        {errorDetails && (
          <details className="text-sm text-white/60 mb-4">
            <summary className="cursor-pointer">Error Details</summary>
            <pre className="mt-2 text-left bg-white/5 p-2 rounded overflow-auto">
              {errorDetails}
            </pre>
          </details>
        )}
        <button
          onClick={() => window.location.href = '/'}
          className="bg-[#C40505] hover:bg-[#a00404] text-white font-bold py-2 px-4 rounded"
        >
          Go Home
        </button>
      </div>
    </div>
  );
};

export default ErrorBoundary;
