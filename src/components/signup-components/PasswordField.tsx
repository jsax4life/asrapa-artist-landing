import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface PasswordFieldProps {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  className?: string;
  error?: string;
}

export const PasswordField: React.FC<PasswordFieldProps> = ({
  label,
  placeholder,
  value,
  onChange,
  required = false,
  className = '',
  error
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className={`flex flex-col w-full ${className}`}>
      <label className="text-white font-bold tracking-[0.13px] text-sm mb-2">
        {label}
      </label>
      <div className={`bg-[rgba(210,216,218,0.16)] flex min-h-12 w-full items-center overflow-hidden text-[#D2D8DA] font-normal tracking-[-0.15px] px-4 py-3 rounded-lg ${error ? 'border-2 border-red-500' : ''}`}>
        <input
          type={showPassword ? 'text' : 'password'}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          className="text-[#D2D8DA] bg-transparent border-none outline-none flex-1 placeholder:text-[#D2D8DA] text-sm mr-2"
          aria-label={label}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="flex w-6 h-6 items-center justify-center text-[#D2D8DA] hover:text-white transition-colors shrink-0"
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
      {error && (
        <p className="text-red-500 text-xs mt-1">{error}</p>
      )}
    </div>
  );
};
