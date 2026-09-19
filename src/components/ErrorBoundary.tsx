import React, { Component, ErrorInfo, ReactNode, useEffect } from 'react';
import { useRouteError, isRouteErrorResponse } from 'react-router-dom';
import { isChunkLoadError } from '@/lib/lazyWithRetry';

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

  let resolvedError: Error | null = null;
  if (routeError instanceof Error) {
    resolvedError = routeError;
  } else if (error) {
    resolvedError = error;
  }

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

  const chunkError = resolvedError && isChunkLoadError(resolvedError);

  useEffect(() => {
    if (chunkError && !sessionStorage.getItem('asrapa:chunk-reload')) {
      sessionStorage.setItem('asrapa:chunk-reload', '1');
      window.location.reload();
    }
  }, [chunkError]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="text-center max-w-md mx-auto p-6">
        <h1 className="text-4xl font-bold text-[#FF0000] mb-4">Oops!</h1>
        <h2 className="text-2xl font-semibold mb-4 text-white">
          {chunkError
            ? 'A new version of the app is available. Refreshing…'
            : errorMessage}
        </h2>
        {errorDetails && !chunkError && (
          <details className="text-sm text-white/60 mb-4">
            <summary className="cursor-pointer">Error Details</summary>
            <pre className="mt-2 text-left bg-white/5 p-2 rounded overflow-auto">
              {errorDetails}
            </pre>
          </details>
        )}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {chunkError ? (
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="bg-[#FF0000] hover:bg-[#a00404] text-white font-bold py-2 px-4 rounded"
            >
              Refresh page
            </button>
          ) : null}
          <button
            type="button"
            onClick={() => {
              window.location.href = '/';
            }}
            className="bg-white/10 hover:bg-white/20 text-white font-bold py-2 px-4 rounded"
          >
            Go Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorBoundary;
