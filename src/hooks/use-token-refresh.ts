import { useEffect, useRef } from 'react';
import { authService } from '@/lib/auth';

export const useTokenRefresh = () => {
  const refreshTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const checkAndRefreshToken = async () => {
      if (authService.needsTokenRefresh()) {
        try {
          // Call your refresh token endpoint here
          // const response = await api.refreshToken(authService.getRefreshToken());
          // authService.updateAccessToken(response.data.accessToken, response.data.expiresAt);
          
          console.log('Token refresh needed');
        } catch (error) {
          console.error('Token refresh failed:', error);
          // If refresh fails, logout the user
          authService.clearAuthData();
        }
      }
    };

    // Check token refresh on mount
    checkAndRefreshToken();

    // Set up periodic check (every 5 minutes)
    const interval = setInterval(checkAndRefreshToken, 5 * 60 * 1000);

    return () => {
      clearInterval(interval);
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }
    };
  }, []);

  return {
    refreshToken: async () => {
      if (authService.needsTokenRefresh()) {
        try {
          // Call your refresh token endpoint here
          // const response = await api.refreshToken(authService.getRefreshToken());
          // authService.updateAccessToken(response.data.accessToken, response.data.expiresAt);
          
          console.log('Token refreshed manually');
        } catch (error) {
          console.error('Manual token refresh failed:', error);
          authService.clearAuthData();
          throw error;
        }
      }
    }
  };
};
