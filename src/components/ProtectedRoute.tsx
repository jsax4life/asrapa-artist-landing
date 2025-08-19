import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
  isAuthenticated?: boolean;
  redirectTo?: string;
  fallback?: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  isAuthenticated = true, // Default to true for now, can be changed based on auth state
  redirectTo = '/',
  fallback = null,
}) => {
  const location = useLocation();

  // If not authenticated, redirect to specified path
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // If loading state, show fallback
  if (fallback) {
    return <>{fallback}</>;
  }

  // If authenticated, render children
  return <>{children}</>;
};

export default ProtectedRoute;
