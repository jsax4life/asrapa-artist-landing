import { useCallback, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { api, ApiError } from '@/lib/api';
import { persistAuthResponse } from '@/lib/auth-utils';
import { initFacebookSdk, loadFacebookScript } from '@/lib/oauth-scripts';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';

export const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
export const FACEBOOK_APP_ID = import.meta.env.VITE_FACEBOOK_APP_ID;

export const useSocialAuth = (stageName?: string) => {
  const { login } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isFacebookLoading, setIsFacebookLoading] = useState(false);

  const handleAuthSuccess = useCallback(
    (response: Awaited<ReturnType<typeof api.googleAuth>>) => {
      const { isNewUser } = persistAuthResponse(response, login);

      toast({
        title: isNewUser ? 'Bienvenue sur AsraPa !' : 'Bon retour !',
        description: isNewUser
          ? 'Votre compte a été créé avec succès.'
          : 'Vous êtes maintenant connecté.',
      });

      navigate(ROUTES.DASHBOARD, { replace: true });
    },
    [login, navigate, toast]
  );

  const socialMutation = useMutation({
    mutationFn: async ({
      provider,
      token,
    }: {
      provider: 'google' | 'facebook';
      token: string;
    }) => {
      const payload = stageName?.trim() ? { stageName: stageName.trim() } : {};
      return provider === 'google'
        ? api.googleAuth({ idToken: token, ...payload })
        : api.facebookAuth({ accessToken: token, ...payload });
    },
    onSuccess: handleAuthSuccess,
    onError: (error: ApiError) => {
      toast({
        title: 'Échec de la connexion',
        description: error.message || 'Impossible de terminer la connexion via ce réseau.',
        variant: 'destructive',
      });
    },
  });

  const onGoogleCredential = useCallback(
    (credential: string) => {
      socialMutation.mutate({ provider: 'google', token: credential });
    },
    [socialMutation]
  );

  const signInWithFacebook = useCallback(async () => {
    if (!FACEBOOK_APP_ID) {
      toast({
        title: 'Connexion Facebook indisponible',
        description: 'L\'identifiant de l\'application Facebook n\'est pas configuré.',
        variant: 'destructive',
      });
      return;
    }

    setIsFacebookLoading(true);
    try {
      await loadFacebookScript();
      initFacebookSdk(FACEBOOK_APP_ID);

      if (!window.FB) {
        throw new Error('Facebook SDK not available');
      }

      window.FB.login(
        (response) => {
          setIsFacebookLoading(false);
          if (response.authResponse?.accessToken) {
            socialMutation.mutate({
              provider: 'facebook',
              token: response.authResponse.accessToken,
            });
          } else {
            toast({
              title: 'Connexion Facebook annulée',
              description: 'La connexion a été annulée ou n\'a pas retourné de jeton d\'accès.',
              variant: 'destructive',
            });
          }
        },
        { scope: 'email', return_scopes: true }
      );
    } catch (error) {
      setIsFacebookLoading(false);
      toast({
        title: 'Échec de la connexion Facebook',
        description: error instanceof Error ? error.message : 'Impossible d\'ouvrir la connexion Facebook.',
        variant: 'destructive',
      });
    }
  }, [socialMutation, toast]);

  return {
    onGoogleCredential,
    signInWithFacebook,
    isSocialLoading: socialMutation.isPending,
    isFacebookLoading: isFacebookLoading || socialMutation.isPending,
    isGoogleConfigured: !!GOOGLE_CLIENT_ID,
    isFacebookConfigured: !!FACEBOOK_APP_ID,
  };
};
