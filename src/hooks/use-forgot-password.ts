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
        title: 'Vérifiez votre e-mail',
        description: response.message || 'Un code à 6 chiffres a été envoyé à votre e-mail.',
      });
      navigate(ROUTES.RESET_PASSWORD, { state: { email } });
    },
    onError: (error: ApiError) => {
      toast({
        title: 'Échec de la demande',
        description: error.message || 'Impossible d\'envoyer le code de réinitialisation. Veuillez réessayer.',
        variant: 'destructive',
      });
    },
  });

  return {
    sendResetCode: mutation.mutate,
    isSending: mutation.isPending,
  };
};
