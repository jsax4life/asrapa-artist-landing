import React, { useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDown, Search } from 'lucide-react';

interface CitySelectProps {
  value: string;
  onChange: (value: string) => void;
  cities: string[];
  className?: string;
  error?: string;
}

/** Sélecteur de ville avec recherche, alimenté par la liste de villes du pays choisi. */
export const CitySelect: React.FC<CitySelectProps> = ({
  value,
  onChange,
  cities,
  className = '',
  error,
}) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [freeTextMode, setFreeTextMode] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return cities;
    return cities.filter((c) => c.toLowerCase().includes(q));
  }, [cities, query]);

  const open = () => {
    setIsOpen(true);
    requestAnimationFrame(() => searchRef.current?.focus());
  };

  const selectCity = (city: string) => {
    onChange(city);
    setIsOpen(false);
    setQuery('');
  };

  if (freeTextMode) {
    return (
      <div className={`flex flex-col w-full ${className}`}>
        <label className="text-white font-bold tracking-[0.13px] text-sm mb-2">
          {t('signup.form.city')}
        </label>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={t('signup.form.cityFreeTextPlaceholder')}
          className={`bg-[rgba(210,216,218,0.16)] min-h-12 w-full text-[#D2D8DA] font-normal tracking-[-0.15px] px-4 py-3 rounded-lg outline-none ${error ? 'border-2 border-red-500' : ''}`}
          aria-label={t('signup.form.city')}
        />
        <button
          type="button"
          onClick={() => {
            setFreeTextMode(false);
            onChange('');
          }}
          className="mt-1 self-start text-xs text-[#FF0000] hover:underline"
        >
          {t('signup.form.cityBackToList')}
        </button>
        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
      </div>
    );
  }

  return (
    <div className={`flex flex-col w-full ${className}`}>
      <label className="text-white font-bold tracking-[0.13px] text-sm mb-2">
        {t('signup.form.city')}
      </label>
      <div className="relative">
        <button
          type="button"
          onClick={() => (isOpen ? setIsOpen(false) : open())}
          className={`bg-[rgba(210,216,218,0.16)] flex min-h-12 w-full items-center text-[#D2D8DA] font-normal tracking-[-0.15px] px-4 py-3 rounded-lg ${error ? 'border-2 border-red-500' : ''}`}
          aria-label={t('signup.form.city')}
          aria-expanded={isOpen}
        >
          <div className="flex items-center justify-between w-full">
            <div className="text-[#D2D8DA] flex-1 text-left text-sm truncate">
              {value || t('signup.form.cityPlaceholder')}
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
                placeholder={t('signup.form.citySearch')}
                className="w-full bg-transparent text-sm text-white placeholder:text-[#D2D8DA]/50 outline-none"
              />
            </div>
            <div className="max-h-56 overflow-y-auto">
              {filtered.length === 0 ? (
                <p className="px-4 py-3 text-sm text-[#D2D8DA]/60">
                  {t('signup.form.cityNoResults')}
                </p>
              ) : (
                filtered.map((city) => (
                  <button
                    key={city}
                    type="button"
                    onClick={() => selectCity(city)}
                    className={`w-full text-left px-4 py-2 text-sm transition-colors hover:bg-[rgba(210,216,218,0.12)] ${
                      city === value ? 'text-[#FF0000] font-semibold' : 'text-[#D2D8DA]'
                    }`}
                  >
                    {city}
                  </button>
                ))
              )}
            </div>
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                setQuery('');
                setFreeTextMode(true);
                onChange('');
              }}
              className="w-full text-left px-4 py-2.5 text-sm text-[#D2D8DA]/70 hover:text-white border-t border-[rgba(210,216,218,0.16)] transition-colors"
            >
              {t('signup.form.cityNotListed')}
            </button>
          </div>
        )}
      </div>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};
