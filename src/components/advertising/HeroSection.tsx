import React from 'react';
import { useTranslation } from 'react-i18next';
import heroImage from '@/assets/images/hero.jpg';

const HeroSection: React.FC = () => {
  const { t } = useTranslation();
  const brand = t('brand');

  const scrollToForm = () => {
    document.getElementById('get-started-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative w-full min-h-[70vh] flex items-center justify-center overflow-hidden">
      <img
        src={heroImage}
        alt="Audio mixing console with red indicator lights"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-black/60" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-24 text-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-8">
          <span className="text-[#C40505]">{brand}:</span>{' '}
          <span className="text-white">{t('advertising.heroTitle')}</span>
        </h1>
        <button
          onClick={scrollToForm}
          className="bg-[#C40505] hover:bg-[#a00404] text-white font-bold text-lg px-10 py-3 rounded-full transition-colors"
        >
          {t('common.getStarted')}
        </button>
      </div>
    </section>
  );
};

export default HeroSection;
