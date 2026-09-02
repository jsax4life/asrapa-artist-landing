import React from 'react';
import { useTranslation } from 'react-i18next';
import artistGuideHero from '@/assets/images/artist-guide-hero.jpg';

const Hero = () => {
  const { t } = useTranslation();

  return (
    <section className="flex flex-col relative min-h-[502px] w-full items-stretch text-xl font-bold pb-36 max-md:max-w-full max-md:pb-[100px]">
      <img
        src={artistGuideHero}
        alt="Silhouette d'un artiste sur scène pendant un concert"
        className="absolute h-full w-full object-cover inset-0"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
      <div className="relative ml-[131px] mt-[141px] max-md:ml-2.5 max-md:mt-10">
        <h1 className="text-[42px] leading-[1.05] font-black tracking-tight text-white sm:text-[56px] sm:leading-[1.02]">
          {t('artistGuide.title')}
        </h1>
      </div>
    </section>
  );
};

export default Hero;
