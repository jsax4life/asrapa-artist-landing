import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { FormField } from './FormField';
import { PasswordField } from './PasswordField';
import { CountrySelect } from './CountrySelect';
import { CitySelect } from './CitySelect';
import { TermsCheckbox } from './TermsCheckbox';
import { useArtistSignup } from '@/hooks/use-artist-signup';
import { useToast } from '@/hooks/use-toast';
import SocialAuthButtons from '@/components/auth/SocialAuthButtons';

interface FormData {
  fullName: string;
  stageName: string;
  email: string;
  password: string;
  confirmPassword: string;
  country: string;
  city: string;
  agreeToTerms: boolean;
}

interface FormErrors {
  fullName?: string;
  stageName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  country?: string;
  city?: string;
  agreeToTerms?: string;
}

export const SignUpForm: React.FC = () => {
  const { t } = useTranslation();
  const brand = t('brand');
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    stageName: '',
    email: '',
    password: '',
    confirmPassword: '',
    country: '',
    city: '',
    agreeToTerms: false
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const [isCheckingStageName, setIsCheckingStageName] = useState(false);
  const [emailStatus, setEmailStatus] = useState<'idle' | 'checking' | 'available' | 'unavailable' | 'error'>('idle');
  const [stageNameStatus, setStageNameStatus] = useState<'idle' | 'checking' | 'available' | 'unavailable' | 'error'>('idle');
  
  const { signup, isSigningUp, checkEmailAvailability, checkStageNameAvailability } = useArtistSignup();
  const { toast } = useToast();

  // Use refs to store stable debounced functions
  const debouncedEmailCheckRef = useRef<((email: string) => void) | null>(null);
  const debouncedStageNameCheckRef = useRef<((stageName: string) => void) | null>(null);

  const validatePassword = (password: string): boolean => {
    const minLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[@$!%*?&]/.test(password);
    
    return minLength && hasUpperCase && hasNumber && hasSpecialChar;
  };

  const getPasswordStrength = (password: string) => {
    if (!password) return { score: 0, label: '', color: '' };
    
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[@$!%*?&]/.test(password)) score++;
    
    const strengthMap = {
      0: { label: 'Very Weak', color: 'text-red-500' },
      1: { label: 'Weak', color: 'text-orange-500' },
      2: { label: 'Fair', color: 'text-yellow-500' },
      3: { label: 'Good', color: 'text-blue-500' },
      4: { label: 'Strong', color: 'text-green-500' }
    };
    
    return { score, ...strengthMap[score as keyof typeof strengthMap] };
  };

  const validateForm = async (): Promise<boolean> => {
    const newErrors: FormErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Le nom complet est requis';
    }

    if (!formData.stageName.trim()) {
      newErrors.stageName = 'Le nom de scène est requis';
    } else {
      // Check stage name availability
      setIsCheckingStageName(true);
      try {
        const isAvailable = await checkStageNameAvailability(formData.stageName);
        if (!isAvailable) {
          newErrors.stageName = 'Ce nom de scène est déjà pris';
        }
      } catch (error) {
        console.error('Error checking stage name:', error);
      } finally {
        setIsCheckingStageName(false);
      }
    }

    if (!formData.email.trim()) {
      newErrors.email = "L'e-mail est requis";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "L'e-mail est invalide";
    } else {
      // Check email availability
      setIsCheckingEmail(true);
      try {
        const isAvailable = await checkEmailAvailability(formData.email);
        if (!isAvailable) {
          newErrors.email = 'Un compte existe déjà avec cet e-mail';
        }
      } catch (error) {
        console.error('Error checking email:', error);
      } finally {
        setIsCheckingEmail(false);
      }
    }

    if (!formData.password) {
      newErrors.password = 'Le mot de passe est requis';
    } else if (!validatePassword(formData.password)) {
      newErrors.password = 'Le mot de passe ne respecte pas les exigences';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Veuillez confirmer votre mot de passe';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }

    if (!formData.country) {
      newErrors.country = 'Veuillez sélectionner un pays';
    }

    if (formData.country === 'Tchad' && !formData.city) {
      newErrors.city = 'Veuillez sélectionner votre ville';
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'Vous devez accepter les conditions générales';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Ensure no availability checks are pending and no errors exist before submitting
    if (isCheckingEmail || isCheckingStageName || emailStatus === 'error' || stageNameStatus === 'error') {
      toast({
        title: "Erreur de validation",
        description: "Attendez la fin des vérifications de disponibilité ou résolvez les problèmes réseau.",
        variant: "destructive",
      });
      return;
    }
    
    if (await validateForm()) {
      const { confirmPassword, city, country, ...rest } = formData;
      const signupData = {
        ...rest,
        country,
        // On ne joint la ville que pour le Tchad, elle n'a pas de sens ailleurs.
        ...(country === 'Tchad' && city ? { city } : {}),
      };
      signup(signupData);
    }
  };

  const updateFormData = (field: keyof FormData) => (value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
      // Une ville choisie pour le Tchad ne veut plus rien dire si on change de pays.
      ...(field === 'country' && value !== 'Tchad' ? { city: '' } : {}),
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }

    // Reset status when user starts typing
    if (field === 'email') {
      setEmailStatus('idle');
    } else if (field === 'stageName') {
      setStageNameStatus('idle');
    }
  };

  // Initialize debounced functions once - 3000ms wait
  useEffect(() => {
    debouncedEmailCheckRef.current = debounce(async (email: string) => {
      if (email && /\S+@\S+\.\S+/.test(email)) {
        setIsCheckingEmail(true);
        setEmailStatus('checking');
        try {
          const isAvailable = await checkEmailAvailability(email);
          if (!isAvailable) {
            setErrors(prev => ({ ...prev, email: 'An account with this email already exists' }));
            setEmailStatus('unavailable');
          } else {
            // Clear email error if it was previously set
            setErrors(prev => ({ ...prev, email: undefined }));
            setEmailStatus('available');
          }
        } catch (error) {
          console.error('Error checking email:', error);
          // Show a toast message for network error
          toast({
            title: "Erreur réseau",
            description: "Impossible de vérifier la disponibilité de l'e-mail. Vérifiez votre connexion internet.",
            variant: "destructive",
          });
          setEmailStatus('error'); // Set status to error
          setErrors(prev => ({ ...prev, email: "Impossible de vérifier l'e-mail. Veuillez réessayer." }));
        } finally {
          setIsCheckingEmail(false);
        }
      }
    }, 3000);

    debouncedStageNameCheckRef.current = debounce(async (stageName: string) => {
      if (stageName && stageName.length >= 2) {
        setIsCheckingStageName(true);
        setStageNameStatus('checking');
        try {
          const isAvailable = await checkStageNameAvailability(stageName);
          if (!isAvailable) {
            setErrors(prev => ({ ...prev, stageName: 'This stage name is already taken' }));
            setStageNameStatus('unavailable');
          } else {
            // Clear stage name error if it was previously set
            setErrors(prev => ({ ...prev, stageName: undefined }));
            setStageNameStatus('available');
          }
        } catch (error) {
          console.error('Error checking stage name:', error);
          // Show a toast message for network error
          toast({
            title: "Erreur réseau",
            description: "Impossible de vérifier la disponibilité du nom de scène. Vérifiez votre connexion internet.",
            variant: "destructive",
          });
          setStageNameStatus('error'); // Set status to error
          setErrors(prev => ({ ...prev, stageName: 'Impossible de vérifier le nom de scène. Veuillez réessayer.' }));
        } finally {
          setIsCheckingStageName(false);
        }
      }
    }, 3000);
  }, [checkEmailAvailability, checkStageNameAvailability, toast]); // Added toast as a dependency

  // Debounce utility function (cancels previous timer)
  function debounce<T extends (...args: unknown[]) => unknown>(
    func: T,
    wait: number
  ): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  }

  // Trigger debounced validation when email or stage name changes
  useEffect(() => {
    if (formData.email && /\S+@\S+\.\S+/.test(formData.email) && debouncedEmailCheckRef.current) {
      debouncedEmailCheckRef.current(formData.email);
    }
  }, [formData.email]);

  useEffect(() => {
    if (formData.stageName && formData.stageName.length >= 2 && debouncedStageNameCheckRef.current) {
      debouncedStageNameCheckRef.current(formData.stageName);
    }
  }, [formData.stageName]);

  // Immediate check on blur for email and stage name
  const handleEmailBlur = async () => {
    const email = formData.email;
    if (email && /\S+@\S+\.\S+/.test(email)) {
      setIsCheckingEmail(true);
      setEmailStatus('checking');
      try {
        const isAvailable = await checkEmailAvailability(email);
        if (!isAvailable) {
          setErrors(prev => ({ ...prev, email: 'An account with this email already exists' }));
          setEmailStatus('unavailable');
        } else {
          setErrors(prev => ({ ...prev, email: undefined }));
          setEmailStatus('available');
        }
      } catch (error) {
        console.error('Error checking email:', error);
        toast({
          title: "Erreur réseau",
          description: "Impossible de vérifier la disponibilité de l'e-mail. Vérifiez votre connexion internet.",
          variant: "destructive",
        });
        setEmailStatus('error'); // Set status to error
        setErrors(prev => ({ ...prev, email: "Impossible de vérifier l'e-mail. Veuillez réessayer." }));
      } finally {
        setIsCheckingEmail(false);
      }
    }
  };

  const handleStageNameBlur = async () => {
    const stageName = formData.stageName;
    if (stageName && stageName.length >= 2) {
      setIsCheckingStageName(true);
      setStageNameStatus('checking');
      try {
        const isAvailable = await checkStageNameAvailability(stageName);
        if (!isAvailable) {
          setErrors(prev => ({ ...prev, stageName: 'This stage name is already taken' }));
          setStageNameStatus('unavailable');
        } else {
          setErrors(prev => ({ ...prev, stageName: undefined }));
          setStageNameStatus('available');
        }
      } catch (error) {
        console.error('Error checking stage name:', error);
        toast({
          title: "Erreur réseau",
          description: "Impossible de vérifier la disponibilité du nom de scène. Vérifiez votre connexion internet.",
          variant: "destructive",
        });
        setStageNameStatus('error'); // Set status to error
        setErrors(prev => ({ ...prev, stageName: 'Impossible de vérifier le nom de scène. Veuillez réessayer.' }));
      } finally {
        setIsCheckingStageName(false);
      }
    }
  };

  // La ville n'est exigée que pour le Tchad ; pour tout autre pays, elle est sans objet.
  const cityOk = formData.country !== 'Tchad' || Boolean(formData.city);

  return (
    <div className="flex w-full flex-col items-center max-w-4xl mx-auto px-4 sm:px-6">
      <header className="flex flex-col items-center text-center mb-8">
        <h1 className="text-white text-2xl sm:text-3xl lg:text-[40px] font-bold leading-[1.1]">
          <span style={{ color: 'rgba(210,216,218,1)' }}>{t('signup.join')}</span>{' '}
          <span style={{ color: 'rgba(196,5,5,1)' }}>{brand}</span>
        </h1>
        <p className="text-[#D2D8DA] text-sm sm:text-base font-medium mt-4 px-4">
          {t('signup.tagline')}
        </p>
      </header>

      <div className="w-full max-w-2xl mb-6">
        <SocialAuthButtons stageName={formData.stageName} disabled={isSigningUp} />
      </div>

      <div className="w-full max-w-2xl grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
      <form id="artist-signup-form" onSubmit={handleSubmit} className="contents">
        <FormField
          label={t('signup.form.fullName')}
          placeholder={t('signup.form.fullNamePlaceholder')}
          value={formData.fullName}
          onChange={updateFormData('fullName')}
          required
          error={errors.fullName}
        />

        <FormField
          label={t('signup.form.stageName')}
          placeholder={t('signup.form.stageNamePlaceholder')}
          value={formData.stageName}
          onChange={updateFormData('stageName')}
          onBlur={handleStageNameBlur}
          required
          error={errors.stageName}
          isLoading={isCheckingStageName}
          status={stageNameStatus}
        />

        <FormField
          label={t('signup.form.email')}
          type="email"
          placeholder={t('signup.form.emailPlaceholder')}
          value={formData.email}
          onChange={updateFormData('email')}
          onBlur={handleEmailBlur}
          required
          error={errors.email}
          isLoading={isCheckingEmail}
          status={emailStatus}
        />

        <div className="flex flex-col w-full">
          <PasswordField
            label={t('signup.form.password')}
            placeholder={t('signup.form.passwordPlaceholder')}
            value={formData.password}
            onChange={updateFormData('password')}
            required
            error={errors.password}
          />
          {formData.password && (
            <div className="mt-2">
              <div className="flex items-center gap-2 mb-1">
                <div className="flex-1 bg-white/10 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${
                      getPasswordStrength(formData.password).score === 0 ? 'w-0' :
                      getPasswordStrength(formData.password).score === 1 ? 'w-1/4 bg-red-500' :
                      getPasswordStrength(formData.password).score === 2 ? 'w-1/2 bg-orange-500' :
                      getPasswordStrength(formData.password).score === 3 ? 'w-3/4 bg-blue-500' :
                      'w-full bg-green-500'
                    }`}
                  />
                </div>
                <span className={`text-xs font-medium ${getPasswordStrength(formData.password).color}`}>
                  {getPasswordStrength(formData.password).label}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-1 text-xs text-white/50">
                <div className={`flex items-center gap-1 ${formData.password.length >= 8 ? 'text-green-500' : ''}`}>
                  <span>{formData.password.length >= 8 ? '✓' : '○'}</span>
                  <span>{t('signup.form.chars8')}</span>
                </div>
                <div className={`flex items-center gap-1 ${/[A-Z]/.test(formData.password) ? 'text-green-500' : ''}`}>
                  <span>{/[A-Z]/.test(formData.password) ? '✓' : '○'}</span>
                  <span>{t('signup.form.uppercase')}</span>
                </div>
                <div className={`flex items-center gap-1 ${/\d/.test(formData.password) ? 'text-green-500' : ''}`}>
                  <span>{/\d/.test(formData.password) ? '✓' : '○'}</span>
                  <span>{t('signup.form.number')}</span>
                </div>
                <div className={`flex items-center gap-1 ${/[@$!%*?&]/.test(formData.password) ? 'text-green-500' : ''}`}>
                  <span>{/[@$!%*?&]/.test(formData.password) ? '✓' : '○'}</span>
                  <span>{t('signup.form.specialChar')}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col w-full">
          <PasswordField
            label={t('signup.form.confirmPassword')}
            placeholder={t('signup.form.passwordPlaceholder')}
            value={formData.confirmPassword}
            onChange={updateFormData('confirmPassword')}
            required
            error={errors.confirmPassword}
          />
          {formData.confirmPassword && (
            <div className="mt-2">
              <div className={`flex items-center gap-2 text-xs ${
                formData.password === formData.confirmPassword 
                  ? 'text-green-500' 
                  : 'text-red-500'
              }`}>
                <span>
                  {formData.password === formData.confirmPassword ? '✓' : '✗'}
                </span>
                <span>
                  {formData.password === formData.confirmPassword 
                    ? t('signup.form.passwordsMatch')
                    : t('signup.form.passwordsNoMatch')
                  }
                </span>
              </div>
            </div>
          )}
        </div>

        <CountrySelect
          value={formData.country}
          onChange={updateFormData('country')}
          error={errors.country}
        />

        {formData.country === 'Tchad' && (
          <CitySelect
            value={formData.city}
            onChange={updateFormData('city')}
            error={errors.city}
          />
        )}

      </form>

        <div className="md:col-span-2 relative z-10">
          <TermsCheckbox
            checked={formData.agreeToTerms}
            onChange={updateFormData('agreeToTerms')}
            error={errors.agreeToTerms}
          />
        </div>

        <div className="md:col-span-2 flex justify-center mt-4">
          <button
            type="submit"
            form="artist-signup-form"
            className={`w-full sm:w-auto min-w-[280px] max-w-[328px] min-h-12 px-8 py-3 text-sm sm:text-base text-white font-semibold rounded-full transition-all duration-300 ${
              isSigningUp
                ? 'bg-[#C40505]/30 text-white/50 cursor-not-allowed'
                : formData.agreeToTerms && 
                  formData.fullName && 
                  formData.stageName && 
                  formData.email && 
                  formData.password && 
                  formData.confirmPassword && 
                  formData.country &&
                  cityOk &&
                  emailStatus === 'available' &&
                  stageNameStatus === 'available' &&
                  formData.password === formData.confirmPassword &&
                  validatePassword(formData.password)
                ? 'bg-green-600 hover:bg-green-700 shadow-lg'
                : 'bg-[#C40505] hover:bg-[#E60606] disabled:opacity-50 disabled:cursor-not-allowed'
            }`}
            disabled={!formData.agreeToTerms || isSigningUp || isCheckingEmail || isCheckingStageName || !cityOk || !validatePassword(formData.password) || emailStatus === 'unavailable' || stageNameStatus === 'unavailable' || emailStatus === 'error' || stageNameStatus === 'error'}
          >
            {isSigningUp ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                {t('signup.form.creatingAccount')}
              </div>
            ) : formData.agreeToTerms && 
                formData.fullName && 
                formData.stageName && 
                formData.email && 
                formData.password && 
                formData.confirmPassword && 
                formData.country &&
                  cityOk &&
                emailStatus === 'available' &&
                stageNameStatus === 'available' &&
                formData.password === formData.confirmPassword &&
                validatePassword(formData.password) ? (
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {t('signup.form.readyToCreate')}
              </div>
            ) : (
              t('signup.form.continue')
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
