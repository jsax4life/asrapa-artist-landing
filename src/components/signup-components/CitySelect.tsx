import React from 'react';
import { useTranslation } from 'react-i18next';
import { CHAD_CITIES } from '@/lib/countries';

interface CitySelectProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  error?: string;
}

/** Sélecteur de ville, affiché uniquement pour les utilisateurs déclarant le Tchad. */
export const CitySelect: React.FC<CitySelectProps> = ({
  value,
  onChange,
  className = '',
  error,
}) => {
  const { t } = useTranslation();

  return (
    <div className={`flex flex-col w-full ${className}`}>
      <label className="text-white font-bold tracking-[0.13px] text-sm mb-2">
        {t('signup.form.city')}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`bg-[rgba(210,216,218,0.16)] min-h-12 w-full appearance-none text-[#D2D8DA] font-normal tracking-[-0.15px] px-4 py-3 rounded-lg outline-none ${error ? 'border-2 border-red-500' : ''}`}
        aria-label={t('signup.form.city')}
      >
        <option value="" className="bg-black">
          {t('signup.form.cityPlaceholder')}
        </option>
        {CHAD_CITIES.map((city) => (
          <option key={city} value={city} className="bg-black">
            {city}
          </option>
        ))}
      </select>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};
