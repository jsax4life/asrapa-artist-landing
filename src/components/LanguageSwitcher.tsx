import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, Check } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface LanguageSwitcherProps {
  className?: string;
  variant?: 'header' | 'compact';
}

const LANGUAGES = [
  { code: 'en', labelKey: 'language.english', short: 'EN' },
  { code: 'fr', labelKey: 'language.french', short: 'FR' },
] as const;

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  className = '',
  variant = 'header',
}) => {
  const { i18n, t } = useTranslation();
  const currentCode = i18n.language.startsWith('fr') ? 'fr' : 'en';
  const current = LANGUAGES.find((l) => l.code === currentCode) ?? LANGUAGES[0];

  const setLanguage = (code: string) => {
    void i18n.changeLanguage(code);
  };

  const triggerClass =
    variant === 'compact'
      ? 'inline-flex items-center gap-1.5 rounded-md border border-white/20 bg-white/5 px-2.5 py-1.5 text-xs font-medium text-white hover:bg-white/10 transition-colors'
      : 'inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/5 px-3 py-1.5 text-sm font-medium text-white hover:bg-white/10 hover:border-white/40 transition-colors';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={`${triggerClass} ${className}`}
          aria-label={t('language.switch')}
        >
          <Globe className="h-4 w-4 shrink-0 opacity-80" aria-hidden="true" />
          <span className="uppercase tracking-wide">{current.short}</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="min-w-[140px] bg-[#1a1a1a] border-[#333] text-white"
      >
        {LANGUAGES.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onSelect={() => setLanguage(lang.code)}
            className="flex items-center justify-between cursor-pointer focus:bg-[#2a2a2a] focus:text-white"
          >
            <span className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase text-[#888] w-6">
                {lang.short}
              </span>
              {t(lang.labelKey)}
            </span>
            {currentCode === lang.code && (
              <Check className="h-4 w-4 text-[#C40505]" aria-hidden="true" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSwitcher;
