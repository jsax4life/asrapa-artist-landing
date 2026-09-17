import React, { useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDown, Search } from 'lucide-react';
import { COUNTRIES } from '@/lib/countries';
import dialCodesByCountry from '@/lib/dialCodesByCountry.json';

interface PhoneFieldProps {
  dialCode: string;
  localNumber: string;
  onDialCodeChange: (value: string) => void;
  onLocalNumberChange: (value: string) => void;
  className?: string;
  error?: string;
}

const DIAL_CODES = dialCodesByCountry as Record<string, string>;

/**
 * Un indicatif par pays (pas par code unique) : l'artiste retrouve directement
 * son pays dans la liste plutôt que de deviner "+1" parmi plusieurs pays.
 */
const DIAL_CODE_OPTIONS = COUNTRIES.filter((country) => DIAL_CODES[country]).map((country) => ({
  country,
  code: DIAL_CODES[country],
}));

/** Sélecteur d'indicatif + numéro, pour que l'artiste n'ait qu'à taper son numéro local. */
export const PhoneField: React.FC<PhoneFieldProps> = ({
  dialCode,
  localNumber,
  onDialCodeChange,
  onLocalNumberChange,
  className = '',
  error,
}) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const searchRef = useRef<HTMLInputElement>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return DIAL_CODE_OPTIONS;
    return DIAL_CODE_OPTIONS.filter(
      ({ country, code }) => country.toLowerCase().includes(q) || code.includes(q)
    );
  }, [query]);

  const open = () => {
    setIsOpen(true);
    requestAnimationFrame(() => searchRef.current?.focus());
  };

  const selectedCountry = DIAL_CODE_OPTIONS.find((o) => o.code === dialCode)?.country;

  return (
    <div className={`flex flex-col w-full ${className}`}>
      <label className="text-white font-bold tracking-[0.13px] text-sm mb-2">
        {t('signup.form.whatsapp')}
      </label>
      <div className="flex items-stretch gap-2">
        <div className="relative shrink-0">
          <button
            type="button"
            onClick={() => (isOpen ? setIsOpen(false) : open())}
            className={`bg-[rgba(210,216,218,0.16)] flex h-12 items-center gap-1 text-[#D2D8DA] font-normal tracking-[-0.15px] pl-3 pr-2 rounded-lg ${error ? 'border-2 border-red-500' : ''}`}
            aria-label={t('signup.form.whatsappDialCode')}
            aria-expanded={isOpen}
            title={selectedCountry}
          >
            <span className="text-sm">{dialCode || '+…'}</span>
            <ChevronDown className={`w-4 h-4 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </button>

          {isOpen && (
            <div className="absolute top-full left-0 z-20 mt-1 w-64 rounded-lg border border-[rgba(210,216,218,0.16)] bg-black shadow-xl">
              <div className="flex items-center gap-2 border-b border-[rgba(210,216,218,0.16)] px-3 py-2">
                <Search className="size-4 shrink-0 text-[#D2D8DA]/60" />
                <input
                  ref={searchRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={t('signup.form.whatsappDialCodeSearch')}
                  className="w-full bg-transparent text-sm text-white placeholder:text-[#D2D8DA]/50 outline-none"
                />
              </div>
              <div className="max-h-56 overflow-y-auto">
                {filtered.length === 0 ? (
                  <p className="px-4 py-3 text-sm text-[#D2D8DA]/60">
                    {t('signup.form.countryNoResults')}
                  </p>
                ) : (
                  filtered.map(({ country, code }) => (
                    <button
                      key={country}
                      type="button"
                      onClick={() => {
                        onDialCodeChange(code);
                        setIsOpen(false);
                        setQuery('');
                      }}
                      className={`flex w-full items-center justify-between gap-3 text-left px-4 py-2 text-sm transition-colors hover:bg-[rgba(210,216,218,0.12)] ${
                        code === dialCode ? 'text-[#FF0000] font-semibold' : 'text-[#D2D8DA]'
                      }`}
                    >
                      <span className="truncate">{country}</span>
                      <span className="shrink-0 text-[#D2D8DA]/60">{code}</span>
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <input
          type="tel"
          inputMode="tel"
          value={localNumber}
          onChange={(e) => onLocalNumberChange(e.target.value)}
          placeholder={t('signup.form.whatsappPlaceholder')}
          className={`bg-[rgba(210,216,218,0.16)] min-h-12 w-full flex-1 text-[#D2D8DA] font-normal tracking-[-0.15px] px-4 py-3 rounded-lg outline-none ${error ? 'border-2 border-red-500' : ''}`}
          aria-label={t('signup.form.whatsapp')}
        />
      </div>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};
