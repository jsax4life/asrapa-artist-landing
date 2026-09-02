import { useMutation } from '@tanstack/react-query';
import { api, ApiError } from '@/lib/api';
import { persistAuthResponse } from '@/lib/auth-utils';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';

export const useResetPassword = () => {
  const { login } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: (data: { otp: string; password: string; passwordConfirm: string }) =>
      api.resetPassword(data),
    onSuccess: (response) => {
      persistAuthResponse(response, login);

      toast({
        title: 'Password updated',
        description: 'Your password was reset and you are now logged in.',
      });

      navigate(ROUTES.DASHBOARD, { replace: true });
    },
    onError: (error: ApiError) => {
      toast({
        title: 'Reset failed',
        description: error.message || 'Invalid or expired code. Please try again.',
        variant: 'destructive',
      });
    },
  });

  return {
    resetPassword: mutation.mutate,
    isResetting: mutation.isPending,
  };
};
