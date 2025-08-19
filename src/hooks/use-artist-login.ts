import { useMutation } from '@tanstack/react-query';
import { api, ApiError } from '@/lib/api';
import { authService, AuthToken, UserData } from '@/lib/auth';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useLocation, useNavigate } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';

export const useArtistLogin = () => {
  const { login } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const loginMutation = useMutation({
    mutationFn: (credentials: { emailOrStageName: string; password: string }) => api.loginArtist(credentials),
    onSuccess: (response) => {
      toast({
        title: 'Welcome back!',
        description: 'You are now logged in.',
      });

      if (response.newAccessToken) {
        const tokenData: AuthToken = {
          newAccessToken: response.newAccessToken || '',
          expiresIn: response.expiresIn,
        };

        const artist = response.data?.artist || {};
        const userData: UserData = {
          id: artist.id,
          fullName: artist.fullName,
          stageName: artist.stageName,
          email: artist.email,
          country: artist.country,
          createdAt: artist.createdAt,
        };

        authService.setAuthData(tokenData, userData);
        login(userData);
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const from = (location.state as any)?.from?.pathname || ROUTES.DASHBOARD;
      navigate(from, { replace: true });
    },
    onError: (error: ApiError) => {
      toast({
        title: 'Login failed',
        description: error.message || 'Invalid credentials. Please try again.',
        variant: 'destructive',
      });
    },
  });

  return {
    login: loginMutation.mutate,
    isLoggingIn: loginMutation.isPending,
    error: loginMutation.error,
  };
};
