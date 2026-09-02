import { useEffect } from 'react';
import { api } from '@/lib/api';
import { authService } from '@/lib/auth';

export const useTokenRefresh = () => {
  useEffect(() => {
    const refreshIfNeeded = async () => {
      if (!authService.getAccessToken()) return;
      if (!authService.needsTokenRefresh()) return;

      try {
        await api.refreshToken();
      } catch (error) {
        console.error('Token refresh failed:', error);
        authService.clearAuthData();
      }
    };

    void refreshIfNeeded();
    const interval = setInterval(refreshIfNeeded, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);
};
