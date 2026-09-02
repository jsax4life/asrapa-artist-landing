import React, { useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDown, Search } from 'lucide-react';
import { COUNTRIES } from '@/lib/countries';

interface CountrySelectProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  error?: string;
}

export const CountrySelect: React.FC<CountrySelectProps> = ({
  value,
  onChange,
  className = '',
  error,
}) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const searchRef = useRef<HTMLInputElement>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return COUNTRIES;
    return COUNTRIES.filter((c) => c.toLowerCase().includes(q));
  }, [query]);

  const open = () => {
    setIsOpen(true);
    requestAnimationFrame(() => searchRef.current?.focus());
  };

  return (
    <div className={`flex flex-col w-full ${className}`}>
      <label className="text-white font-bold tracking-[0.13px] text-sm mb-2">
        {t('signup.form.country')}
      </label>
      <div className="relative">
        <button
          type="button"
          onClick={() => (isOpen ? setIsOpen(false) : open())}
          className={`bg-[rgba(210,216,218,0.16)] flex min-h-12 w-full items-center text-[#D2D8DA] font-normal tracking-[-0.15px] px-4 py-3 rounded-lg ${error ? 'border-2 border-red-500' : ''}`}
          aria-label={t('signup.form.country')}
          aria-expanded={isOpen}
        >
          <div className="flex items-center justify-between w-full">
            <div className="text-[#D2D8DA] flex-1 text-left text-sm">
              {value || t('signup.form.countryPlaceholder')}
            </div>
            <ChevronDown
              className={`w-5 h-5 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            />
          </div>
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 right-0 z-20 mt-1 rounded-lg border border-[rgba(210,216,218,0.16)] bg-black shadow-xl">
            <div className="flex items-center gap-2 border-b border-[rgba(210,216,218,0.16)] px-3 py-2">
              <Search className="size-4 shrink-0 text-[#D2D8DA]/60" />
              <input
                ref={searchRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t('signup.form.countrySearch')}
                className="w-full bg-transparent text-sm text-white placeholder:text-[#D2D8DA]/50 outline-none"
              />
            </div>
            <div className="max-h-56 overflow-y-auto">
              {filtered.length === 0 ? (
                <p className="px-4 py-3 text-sm text-[#D2D8DA]/60">
                  {t('signup.form.countryNoResults')}
                </p>
              ) : (
                filtered.map((country) => (
                  <button
                    key={country}
                    type="button"
                    onClick={() => {
                      onChange(country);
                      setIsOpen(false);
                      setQuery('');
                    }}
                    className={`w-full text-left px-4 py-2 text-sm transition-colors hover:bg-[rgba(210,216,218,0.12)] ${
                      country === value ? 'text-[#C40505] font-semibold' : 'text-[#D2D8DA]'
                    }`}
                  >
                    {country}
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </div>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};
