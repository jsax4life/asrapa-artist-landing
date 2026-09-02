import { useMutation } from '@tanstack/react-query';
import { api, ApiError } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';

export const useForgotPassword = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: (email: string) => api.forgotPassword(email),
    onSuccess: (response, email) => {
      toast({
        title: 'Check your email',
        description: response.message || 'A 6-digit code was sent to your email.',
      });
      navigate(ROUTES.RESET_PASSWORD, { state: { email } });
    },
    onError: (error: ApiError) => {
      toast({
        title: 'Request failed',
        description: error.message || 'Could not send reset code. Please try again.',
        variant: 'destructive',
      });
    },
  });

  return {
    sendResetCode: mutation.mutate,
    isSending: mutation.isPending,
  };
};
