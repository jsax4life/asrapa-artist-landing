import React from 'react';
import { CheckIcon } from './CheckIcon';

interface PricingFeature {
  text: string;
}

interface PricingCardProps {
  title: string;
  price: string;
  description: string;
  features: PricingFeature[];
  backgroundColor: string;
  textColor: string;
  priceColor: string;
  badge?: string;
  badgeTextColor?: string;
  badgeBorderColor?: string;
  dividerColor?: string;
  buttonBg?: string;
  buttonText?: string;
  termsColor?: string;
}

export const PricingCard: React.FC<PricingCardProps> = ({
  title,
  price,
  description,
  features,
  backgroundColor,
  textColor,
  priceColor,
  badge,
  badgeTextColor = "text-black",
  badgeBorderColor = "border-black",
  dividerColor = "stroke-black",
  buttonBg = "bg-[#131313]",
  buttonText = "text-white",
  termsColor = "text-black"
}) => {
  return (
    <article className={`flex w-[357px] justify-center items-center gap-[9px] h-auto ${backgroundColor} p-9 rounded-[11px] max-md:w-full max-md:max-w-[400px] max-sm:p-6`}>
      <div className="flex flex-col items-start gap-[23px] w-full">
        {badge && (
          <div className={`flex justify-center items-center gap-[11px] rounded border p-[11px] border-solid ${badgeBorderColor}`}>
            <div className={`text-base font-normal leading-[22px] tracking-[-0.173px] ${badgeTextColor}`}>
              {badge}
            </div>
          </div>
        )}
        
        <div className="flex flex-col gap-[27px] w-full">
          <div className="flex flex-col items-start gap-[13px] w-full">
            <h3 className={`text-[27px] font-bold leading-[31px] ${textColor} max-sm:text-2xl`}>
              {title}
            </h3>
            <p className={`text-lg font-normal leading-[22px] tracking-[0.18px] ${priceColor} max-sm:text-base`}>
              {price}
            </p>
            <p className={`text-lg font-normal leading-[22px] tracking-[0.18px] ${textColor} max-sm:text-base`}>
              {description}
            </p>
          </div>
          
          <div>
            <svg width="305" height="2" viewBox="0 0 305 2" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-px">
              <path d="M1.50391 1.05664H303.503" stroke={dividerColor === "stroke-black" ? "black" : "white"} strokeWidth="1.12267" strokeLinecap="round"/>
            </svg>
          </div>
          
          <div className="flex flex-col items-start gap-[13px] w-full">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-[13px] w-full">
                <CheckIcon className="w-[25px] h-4 flex-shrink-0" />
                <div className={`flex-1 text-lg font-normal leading-[22px] tracking-[0.18px] ${textColor} max-sm:text-base`}>
                  {feature.text}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <button className={`flex w-full h-12 justify-center items-center gap-2.5 border cursor-pointer transition-all duration-[0.2s] ease-[ease] ${buttonBg} px-10 py-4 rounded-[104px] border-solid border-white hover:opacity-90`}>
          <span className={`${buttonText} text-base font-bold leading-6 tracking-[-0.45px]`}>
            Subscribe
          </span>
        </button>
        
        <p className={`text-xs font-normal leading-4 tracking-[0.24px] underline ${termsColor}`}>
          Terms and conditions apply
        </p>
      </div>
    </article>
  );
};
