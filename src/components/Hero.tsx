import React from 'react';
import { useTranslation } from 'react-i18next';

const Hero = () => {
  const { t } = useTranslation();

  return (
    <section className="flex flex-col relative min-h-[502px] w-full items-stretch text-xl font-bold pb-36 max-md:max-w-full max-md:pb-[100px]">
      <img
        src="https://api.builder.io/api/v1/image/assets/e4fe701087e74a95b6a29ed12c1bd7bc/32f212dcfb38726935d12726b06ba0105f47ff8c?placeholderIfAbsent=true"
        alt="Hero background"
        className="absolute h-full w-full object-cover inset-0"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
      <div className="relative ml-[131px] mt-[141px] max-md:ml-2.5 max-md:mt-10">
        <p className="mb-3 flex items-center gap-2 text-xs font-semibold tracking-[0.35em] text-[#F6C874] uppercase">
          <span className="h-px w-8 bg-[#F6C874]" />
          {t('brand')}
        </p>
        <h1 className="bg-gradient-to-r from-[#F6C874] to-[#c99a3f] bg-clip-text text-[42px] leading-[1.05] font-black tracking-tight text-transparent sm:text-[56px] sm:leading-[1.02]">
          {t('artistGuide.title')}
        </h1>
      </div>
    </section>
  );
};

export default Hero;
