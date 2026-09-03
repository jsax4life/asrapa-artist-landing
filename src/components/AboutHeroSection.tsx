import React from 'react';
import { useTranslation } from 'react-i18next';
import { Music2 } from 'lucide-react';
import DownloadButtons from './DownloadButtons';
import { PhonePlayer } from './artist-home/PhonePlayer';
import artistPageHero from '@/assets/images/artist-page-hero.jpg';

const AboutHeroSection: React.FC = () => {
  const { t } = useTranslation();
  const brand = t('brand');

  return (
    <div className="w-full min-h-screen relative overflow-x-hidden bg-black">
      <div className="h-[80vh] min-h-[480px] w-full">
        <img
          src={artistPageHero}
          alt={t('about.heroImageAlt')}
          className="h-full w-full object-cover"
          style={{ objectPosition: '38% 68%' }}
        />
      </div>
      <section className="w-full h-[821px] relative flex items-center justify-between box-border bg-black px-[110px] py-0 max-md:h-auto max-md:flex-col max-md:gap-[60px] max-md:px-10 max-md:py-[60px] max-sm:gap-10 max-sm:px-5 max-sm:py-10">
        <div className="flex items-start gap-[81px] w-full max-w-[1292px] relative z-[2] max-md:flex-col max-md:gap-[60px] max-md:w-full max-md:max-w-none max-sm:gap-10">
          <article className="flex flex-col items-start gap-[34px] w-[702px] max-md:w-full max-md:max-w-[600px] max-md:items-center max-md:text-center">
            <header>
              <h1 className="text-white text-5xl font-bold leading-[52px] m-0 max-md:text-4xl max-md:leading-10 max-sm:text-[28px] max-sm:leading-8">
                {t('about.welcome', { brand })}
              </h1>
            </header>
            <p className="w-[702px] text-white text-[28px] font-bold leading-8 m-0 max-md:w-full max-md:text-[22px] max-md:leading-7 max-sm:text-lg max-sm:leading-6">
              {t('about.tagline')}
            </p>
            <div className="flex items-center gap-2.5 text-white/80">
              <Music2 className="size-5 shrink-0 text-[#C40505]" />
              <span className="text-sm font-medium">{t('about.highlight', { brand })}</span>
            </div>
            <DownloadButtons />
          </article>
          <aside className="flex flex-col items-start gap-[13px] relative max-sm:items-center">
            <PhonePlayer />
          </aside>
        </div>
      </section>
    </div>
  );
};

export default AboutHeroSection;
