import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface CountrySelectProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  error?: string;
}

const countries = [
  'United States',
  'Canada',
  'United Kingdom',
  'Australia',
  'Germany',
  'France',
  'Spain',
  'Italy',
  'Japan',
  'South Korea',
  'Brazil',
  'Mexico',
  'India',
  'China',
  'Russia',
  'South Africa',
  'Nigeria',
  'Egypt',
  'Turkey',
  'Netherlands',
  'Sweden',
  'Norway',
  'Denmark',
  'Finland',
  'Poland',
  'Czech Republic',
  'Hungary',
  'Romania',
  'Bulgaria',
  'Greece',
  'Portugal',
  'Ireland',
  'Belgium',
  'Switzerland',
  'Austria',
  'Luxembourg',
  'Iceland',
  'Malta',
  'Cyprus',
  'Estonia',
  'Latvia',
  'Lithuania',
  'Slovenia',
  'Slovakia',
  'Croatia',
  'Serbia',
  'Bosnia and Herzegovina',
  'Montenegro',
  'North Macedonia',
  'Albania',
  'Moldova',
  'Ukraine',
  'Belarus',
  'Georgia',
  'Armenia',
  'Azerbaijan',
  'Kazakhstan',
  'Uzbekistan',
  'Kyrgyzstan',
  'Tajikistan',
  'Turkmenistan',
  'Afghanistan',
  'Pakistan',
  'Bangladesh',
  'Sri Lanka',
  'Nepal',
  'Bhutan',
  'Maldives',
  'Myanmar',
  'Thailand',
  'Vietnam',
  'Cambodia',
  'Laos',
  'Malaysia',
  'Singapore',
  'Indonesia',
  'Philippines',
  'Brunei',
  'East Timor',
  'Papua New Guinea',
  'Fiji',
  'Samoa',
  'Tonga',
  'Vanuatu',
  'Solomon Islands',
  'Palau',
  'Micronesia',
  'Marshall Islands',
  'Kiribati',
  'Tuvalu',
  'Nauru'
];

export const CountrySelect: React.FC<CountrySelectProps> = ({
  value,
  onChange,
  className = '',
  error
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`flex flex-col w-full ${className}`}>
      <label className="text-white font-bold tracking-[0.13px] text-sm mb-2">
        Country/Territory
      </label>
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`bg-[rgba(210,216,218,0.16)] flex min-h-12 w-full items-center text-[#D2D8DA] font-normal tracking-[-0.15px] px-4 py-3 rounded-lg ${error ? 'border-2 border-red-500' : ''}`}
          aria-label="Select country or territory"
          aria-expanded={isOpen}
        >
          <div className="flex items-center justify-between w-full">
            <div className="text-[#D2D8DA] flex-1 text-left text-sm">
              {value || 'Choose Country/Territory'}
            </div>
            <ChevronDown 
              className={`w-5 h-5 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            />
          </div>
        </button>
        
        {isOpen && (
          <div className="absolute top-full left-0 right-0 z-10 bg-[#2A2626] border border-[rgba(210,216,218,0.16)] rounded-lg mt-1 max-h-60 overflow-y-auto">
            {countries.map((country) => (
              <button
                key={country}
                type="button"
                onClick={() => {
                  onChange(country);
                  setIsOpen(false);
                }}
                className="w-full text-left px-4 py-2 text-[#D2D8DA] hover:bg-[rgba(210,216,218,0.16)] transition-colors"
              >
                {country}
              </button>
            ))}
          </div>
        )}
      </div>
      {error && (
        <p className="text-red-500 text-xs mt-1">{error}</p>
      )}
    </div>
  );
};
