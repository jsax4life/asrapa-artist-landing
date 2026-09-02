import { useMutation } from '@tanstack/react-query';
import { api, ApiError } from '@/lib/api';
import { persistAuthResponse } from '@/lib/auth-utils';
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
    mutationFn: (credentials: { emailOrStageName: string; password: string }) =>
      api.loginArtist(credentials),
    onSuccess: (response) => {
      persistAuthResponse(response, login);

      toast({
        title: 'Bon retour !',
        description: 'Vous êtes maintenant connecté.',
      });

      const from = (location.state as { from?: { pathname?: string } })?.from?.pathname;
      navigate(from || ROUTES.DASHBOARD, { replace: true });
    },
    onError: (error: ApiError) => {
      toast({
        title: 'Échec de la connexion',
        description: error.message || 'Identifiants invalides. Veuillez réessayer.',
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
