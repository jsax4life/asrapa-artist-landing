import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { api, ArtistSignupData, ApiError } from '@/lib/api';
import { persistAuthResponse } from '@/lib/auth-utils';
import { useAuth } from '@/contexts/AuthContext';
import i18n from '@/i18n';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';

export const useArtistSignup = () => {
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const [isCheckingStageName, setIsCheckingStageName] = useState(false);
  const { toast } = useToast();
  const { login } = useAuth();
  const navigate = useNavigate();

  const signupMutation = useMutation({
    mutationFn: (data: ArtistSignupData) => api.signupArtist(data),
    onSuccess: (response) => {
      toast({
        title: "Account Created Successfully!",
        description: i18n.t('signup.welcomeToast', { brand: i18n.t('brand') }),
        variant: "default",
      });

      persistAuthResponse(response, login);
      navigate(ROUTES.DASHBOARD, { replace: true });
    },
    onError: (error: ApiError) => {
      let errorMessage = 'An error occurred during signup. Please try again.';
      
      if (error.status === 409) {
        errorMessage = 'An account with this email or stage name already exists.';
      } else if (error.status === 400) {
        errorMessage = error.message || 'Please check your input and try again.';
      } else if (error.status === 0) {
        errorMessage = 'Network error. Please check your connection and try again.';
      }
      
      toast({
        title: "Signup Failed",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });

  const checkEmailAvailability = async (email: string): Promise<boolean> => {
    if (!email || email.length < 3) return true;
    
    setIsCheckingEmail(true);
    try {
      const response = await api.checkEmailAvailability(email);
      return response.available;
    } catch (error) {
      console.error('Error checking email availability:', error);
      return true; // Assume available on error to not block user
    } finally {
      setIsCheckingEmail(false);
    }
  };

  const checkStageNameAvailability = async (stageName: string): Promise<boolean> => {
    if (!stageName || stageName.length < 2) return true;
    
    setIsCheckingStageName(true);
    try {
      const response = await api.checkStageNameAvailability(stageName);
      return response.available;
    } catch (error) {
      console.error('Error checking stage name availability:', error);
      return true; // Assume available on error to not block user
    } finally {
      setIsCheckingStageName(false);
    }
  };

  return {
    signup: signupMutation.mutate,
    isSigningUp: signupMutation.isPending,
    checkEmailAvailability,
    checkStageNameAvailability,
    isCheckingEmail,
    isCheckingStageName,
    error: signupMutation.error,
  };
};

