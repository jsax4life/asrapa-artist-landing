import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { loadGoogleScript } from '@/lib/oauth-scripts';
import { GOOGLE_CLIENT_ID, useSocialAuth } from '@/hooks/use-social-auth';

interface SocialAuthButtonsProps {
  stageName?: string;
  disabled?: boolean;
  className?: string;
}

const SocialAuthButtons: React.FC<SocialAuthButtonsProps> = ({
  stageName,
  disabled = false,
  className = '',
}) => {
  const { t } = useTranslation();
  const googleButtonRef = useRef<HTMLDivElement>(null);
  const {
    onGoogleCredential,
    signInWithFacebook,
    isSocialLoading,
    isFacebookLoading,
    isGoogleConfigured,
    isFacebookConfigured,
  } = useSocialAuth(stageName);

  useEffect(() => {
    if (!isGoogleConfigured || !googleButtonRef.current || disabled) return;

    let cancelled = false;

    const setupGoogleButton = async () => {
      try {
        await loadGoogleScript();
        if (cancelled || !window.google?.accounts?.id || !googleButtonRef.current) return;

        if (import.meta.env.DEV) {
          console.info(
            `[Google Sign-In] Add this origin in Google Cloud Console → Credentials → OAuth client → Authorized JavaScript origins:\n${window.location.origin}`
          );
        }

        googleButtonRef.current.innerHTML = '';

        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: (response) => onGoogleCredential(response.credential),
        });

        window.google.accounts.id.renderButton(googleButtonRef.current, {
          type: 'standard',
          theme: 'outline',
          size: 'large',
          text: 'continue_with',
          shape: 'pill',
          width: googleButtonRef.current.offsetWidth || 320,
        });
      } catch (error) {
        console.error('Failed to initialize Google sign-in:', error);
      }
    };

    void setupGoogleButton();

    return () => {
      cancelled = true;
    };
  }, [disabled, isGoogleConfigured, onGoogleCredential]);

  if (!isGoogleConfigured && !isFacebookConfigured) {
    return null;
  }

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-white/20" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-transparent px-2 text-[#D2D8DA]">{t('auth.orContinueWith')}</span>
        </div>
      </div>

      {isGoogleConfigured && (
        <div
          ref={googleButtonRef}
          className={`flex justify-center min-h-[44px] ${disabled || isSocialLoading ? 'pointer-events-none opacity-50' : ''}`}
        />
      )}

      {isFacebookConfigured && (
        <button
          type="button"
          onClick={signInWithFacebook}
          disabled={disabled || isFacebookLoading || isSocialLoading}
          className="w-full min-h-11 rounded-full border border-white/25 bg-[#1877F2] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#166fe0] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isFacebookLoading ? t('auth.signingIn') : t('auth.continueWithFacebook')}
        </button>
      )}
    </div>
  );
};

export default SocialAuthButtons;
