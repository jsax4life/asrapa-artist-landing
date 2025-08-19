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

  let errorMessage = 'Something went wrong';
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
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center max-w-md mx-auto p-6">
        <h1 className="text-4xl font-bold text-red-600 mb-4">Oops!</h1>
        <h2 className="text-2xl font-semibold mb-4">{errorMessage}</h2>
        {errorDetails && (
          <details className="text-sm text-gray-600 mb-4">
            <summary className="cursor-pointer">Error Details</summary>
            <pre className="mt-2 text-left bg-gray-200 p-2 rounded overflow-auto">
              {errorDetails}
            </pre>
          </details>
        )}
        <button
          onClick={() => window.location.href = '/'}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Go Home
        </button>
      </div>
    </div>
  );
};

export default ErrorBoundary;
