import React from 'react';

interface FormFieldProps {
  label: string;
  type?: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  required?: boolean;
  className?: string;
  error?: string;
  isLoading?: boolean;
  status?: 'idle' | 'checking' | 'available' | 'unavailable';
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  onBlur,
  required = false,
  className = '',
  error,
  isLoading = false,
  status = 'idle'
}) => {
  const getStatusIcon = () => {
    switch (status) {
      case 'checking':
        return (
          <div className="ml-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          </div>
        );
      case 'available':
        return (
          <div className="ml-2">
            <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        );
      case 'unavailable':
        return (
          <div className="ml-2">
            <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        );
      default:
        return null;
    }
  };

  const getBorderColor = () => {
    if (error) return 'border-2 border-red-500';
    switch (status) {
      case 'available':
        return 'border-2 border-green-500';
      case 'unavailable':
        return 'border-2 border-red-500';
      case 'checking':
        return 'border-2 border-yellow-500';
      default:
        return '';
    }
  };

  const getStatusMessage = () => {
    switch (status) {
      case 'available':
        return <p className="text-green-500 text-xs mt-1">✓ Available</p>;
      case 'unavailable':
        return null; // Error message is already shown
      default:
        return null;
    }
  };

  return (
    <div className={`flex flex-col w-full ${className}`}>
      <label className="text-white font-bold tracking-[0.13px] text-sm mb-2">
        {label}
      </label>
      <div className={`bg-[rgba(210,216,218,0.16)] flex min-h-12 w-full items-center overflow-hidden text-[#D2D8DA] font-normal tracking-[-0.15px] px-4 py-3 rounded-lg ${getBorderColor()} ${isLoading ? 'animate-pulse' : ''}`}>
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          required={required}
          className="text-[#D2D8DA] bg-transparent border-none outline-none w-full placeholder:text-[#D2D8DA] text-sm"
          aria-label={label}
          disabled={isLoading}
        />
        {getStatusIcon()}
      </div>
      {error && (
        <p className="text-red-500 text-xs mt-1">{error}</p>
      )}
      {getStatusMessage()}
    </div>
  );
};
