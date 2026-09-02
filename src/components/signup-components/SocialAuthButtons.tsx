import React from 'react';
import { useTranslation } from 'react-i18next';
import { useToast } from '@/hooks/use-toast';

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" aria-hidden="true">
      <path
        fill="#EA4335"
        d="M12 10.2v3.9h5.5c-.24 1.3-1.7 3.8-5.5 3.8-3.3 0-6-2.7-6-6.1s2.7-6.1 6-6.1c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.9 3.1 14.7 2 12 2 6.9 2 2.8 6.1 2.8 11.8s4.1 9.8 9.2 9.8c5.3 0 8.8-3.7 8.8-9 0-.6-.1-1.1-.2-1.6H12z"
      />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" aria-hidden="true">
      <path
        fill="#1877F2"
        d="M24 12.07C24 5.4 18.6 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.68.24 2.68.24v2.96h-1.51c-1.49 0-1.95.93-1.95 1.89v2.26h3.32l-.53 3.49h-2.79V24C19.61 23.1 24 18.1 24 12.07Z"
      />
    </svg>
  );
}

interface SocialAuthButtonsProps {
  className?: string;
}

export const SocialAuthButtons: React.FC<SocialAuthButtonsProps> = ({ className = '' }) => {
  const { t } = useTranslation();
  const { toast } = useToast();

  const handleComingSoon = (provider: string) => {
    toast({
      title: t('signup.social.comingSoonTitle'),
      description: t('signup.social.comingSoonBody', { provider }),
    });
  };

  return (
    <div className={`w-full ${className}`}>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => handleComingSoon('Google')}
          className="flex min-h-12 w-full items-center justify-center gap-2.5 rounded-full border border-[rgba(210,216,218,0.24)] bg-white text-sm font-semibold text-black transition-colors hover:bg-white/90"
        >
          <GoogleIcon />
          {t('signup.social.google')}
        </button>
        <button
          type="button"
          onClick={() => handleComingSoon('Facebook')}
          className="flex min-h-12 w-full items-center justify-center gap-2.5 rounded-full border border-[rgba(210,216,218,0.24)] bg-white text-sm font-semibold text-black transition-colors hover:bg-white/90"
        >
          <FacebookIcon />
          {t('signup.social.facebook')}
        </button>
      </div>

      <div className="my-6 flex items-center gap-3">
        <span className="h-px flex-1 bg-[rgba(210,216,218,0.16)]" />
        <span className="text-xs font-medium uppercase tracking-[0.2em] text-[#D2D8DA]/50">
          {t('signup.social.divider')}
        </span>
        <span className="h-px flex-1 bg-[rgba(210,216,218,0.16)]" />
      </div>
    </div>
  );
};
