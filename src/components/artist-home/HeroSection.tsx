import React from 'react';
import { useTranslation } from 'react-i18next';
import { PhonePlayer } from './PhonePlayer';

export const HeroSection: React.FC = () => {
  const { t } = useTranslation();
  const brand = t('brand');
  const reasons = t('artistHome.reasons', { returnObjects: true }) as {
    title: string;
    body: string;
  }[];

  return (
    <section className="w-full max-w-[1300px] flex flex-col md:flex-row items-center md:items-start relative mx-auto py-10 px-2 md:py-20 md:px-0 gap-8 md:gap-8 lg:gap-12 pb-10 md:pb-16">
      <div className="w-full flex justify-center md:justify-start mb-8 md:mb-0 md:max-w-[320px] lg:max-w-[340px]">
        <PhonePlayer />
      </div>

      <div className="flex flex-col items-center md:items-start gap-6 md:gap-6 lg:gap-8 w-full md:w-2/3 max-w-full md:max-w-[700px]">
        <header className="w-full text-white text-center md:text-left text-2xl xs:text-xl sm:text-3xl md:text-4xl lg:text-5xl font-black leading-tight tracking-tight">
          <h1>
            <span className="font-normal text-2xl xs:text-xl sm:text-3xl md:text-5xl text-white">
              {t('artistHome.whyChoose')}{' '}
            </span>
            <span className="font-normal text-2xl xs:text-xl sm:text-3xl md:text-5xl text-[rgba(196,5,5,1)]">
              {brand}
            </span>
            <span className="font-normal text-2xl xs:text-xl sm:text-3xl md:text-5xl text-white">
              {' '}?
            </span>
          </h1>
        </header>

        <div className="w-full text-base xs:text-sm sm:text-base md:text-lg text-[#D2D8DA] font-normal leading-relaxed md:leading-[38px] tracking-[0.4px]">
          {reasons.map((reason, i) => (
            <section key={reason.title} className={i < reasons.length - 1 ? 'mb-6 sm:mb-8' : ''}>
              <h2 className="font-bold text-white mb-2 sm:mb-4 text-lg sm:text-xl md:text-2xl">
                {reason.title}
              </h2>
              <p className="font-normal text-[rgba(210,216,218,1)] text-sm sm:text-base">
                {reason.body}
              </p>
            </section>
          ))}
        </div>
      </div>
    </section>
  );
};
