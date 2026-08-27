import React from 'react';
import { useTranslation } from 'react-i18next';
import { Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';

interface TermsCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
  error?: string;
}

export const TermsCheckbox: React.FC<TermsCheckboxProps> = ({
  checked,
  onChange,
  className = '',
  error
}) => {
  const { t } = useTranslation();
  const brand = t('brand');

  const openTerms = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    window.open(ROUTES.TERMS, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className={`flex flex-col justify-center w-full py-3 ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-start gap-4">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div className="flex items-center justify-center w-5 h-5 mt-0.5 shrink-0">
            <button
              type="button"
              onClick={() => onChange(!checked)}
              className={`border flex w-4 h-4 rounded items-center justify-center transition-colors ${
                checked ? 'bg-[#C40505] border-[#C40505]' : 'bg-white border-[rgba(118,118,118,1)]'
              } ${error ? 'border-red-500' : ''}`}
              aria-label="Agree to terms and conditions"
              role="checkbox"
              aria-checked={checked}
            >
              {checked && <Check size={10} className="text-white" />}
            </button>
          </div>

          <div className="text-[#D2D8DA] text-sm leading-relaxed">
            <span>{t('signup.agreeTerms', { brand })} </span>
            <a
              href={ROUTES.TERMS}
              onClick={openTerms}
              className="text-[#C40505] font-normal underline hover:text-[#E60606] transition-colors inline-block py-1"
              data-1p-ignore="true"
              data-lpignore="true"
              data-form-type="other"
            >
              {t('signup.termsLink')}
            </a>
          </div>
        </div>

        <div className="text-sm text-[#D2D8DA] shrink-0 sm:text-right">
          <span>{t('signup.alreadyHaveAccount')} </span>
          <Link
            to={ROUTES.LOGIN}
            className="text-[#C40505] font-normal underline hover:text-[#E60606] transition-colors"
          >
            {t('signup.logIn')}
          </Link>
        </div>
      </div>
      {error && (
        <p className="text-red-500 text-xs mt-1">{error}</p>
      )}
    </div>
  );
};
