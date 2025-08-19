import React from 'react';

interface CheckIconProps {
  className?: string;
}

export const CheckIcon: React.FC<CheckIconProps> = ({ className = "w-[25px] h-4" }) => {
  return (
    <svg 
      width="28" 
      height="20" 
      viewBox="0 0 28 20" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path 
        d="M1.31836 9.62362L9.67238 17.9776L26.0172 1.63281" 
        stroke="#1ED760" 
        strokeWidth="2.24535" 
        strokeLinecap="round"
      />
    </svg>
  );
};
