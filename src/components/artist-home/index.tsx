import React from 'react';
import { useTranslation } from 'react-i18next';
import { HeroSection } from './HeroSection';
import { CommunitySection } from './CommunitySection';
import artistHomeImage from '../../assets/images/artist-home.png';

const Index = () => {
  const { t } = useTranslation();
  const brand = t('brand');

  return (
    <main className="w-full  m-0 p-0">
      <div className="relative h-[95vh] min-h-[650px] w-full">
        <img
          src={artistHomeImage}
          alt="Music background"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-10 flex items-center justify-center">
          <div className="text-center mt-40">
            <h1 className="text-white text-4xl sm:text-5xl md:text-6xl font-extrabold mb-4 drop-shadow-lg">
              {t('home.sellWorldwide')}
            </h1>
            <p className="text-white text-base sm:text-lg md:text-xl font-normal mb-8 max-w-2xl mx-auto drop-shadow">
              {t('home.heroDesc', { brand })}
            </p>
            <a
              href="/registration"
              className="inline-block px-8 py-3 bg-[#C40505] text-white text-lg font-bold rounded-full shadow-lg hover:bg-[#a30404] transition-colors duration-200"
            >
              {t('nav.registration')}
            </a>
          </div>
        </div>
      </div>
      <HeroSection />
      <CommunitySection />
    </main>
  );
};

export default Index;
