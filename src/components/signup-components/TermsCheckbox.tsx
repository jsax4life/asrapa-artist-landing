import React from 'react';
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
  return (
    <div className={`flex flex-col justify-center w-full py-3 ${className}`}>
      <div className="flex items-start gap-3 flex-wrap">
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

        <div className='flex justify-between gap-x-6'>
        <div className="flex-1  gap-x-6 min-w-0 text-[#D2D8DA]">
          <span className=" text-sm font-normal">
            I Agree to the AsrapaMusic
          </span>
          <button
            type="button"
            className="text-sm text-[#C40505] font-normal underline hover:text-[#E60606] transition-colors"
            onClick={() => {
              // In a real app, this would open terms modal or navigate to terms page
              window.open('/terms', '_blank');
            }}
          >
            Terms & Conditions
          </button>
        </div>

            <div>
            <span className=" text-sm">Already have an account? </span>
              <Link
                to={ROUTES.LOGIN}
                className="text-sm text-[#C40505] font-normal underline hover:text-[#E60606] transition-colors"
                >
                Log in
              </Link>
            </div>

        </div>
      </div>
      {error && (
        <p className="text-red-500 text-xs mt-1">{error}</p>
      )}
    </div>
  );
};
