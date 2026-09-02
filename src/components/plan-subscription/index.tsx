import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ROUTES } from '@/constants/routes';

const Index = () => {
  const { t } = useTranslation();
  const brand = t('brand');

  return (
    <section className="w-full py-24 max-sm:py-16">
      <div className="mx-auto flex max-w-2xl flex-col items-center gap-6 px-6 text-center">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#C40505]">
          {t('premium.artistCtaEyebrow')}
        </p>
        <h2 className="text-4xl font-bold text-white sm:text-5xl">
          {t('premium.artistCtaTitle')}
        </h2>
        <p className="max-w-lg text-white/70">{t('premium.artistCtaBody', { brand })}</p>
        <div className="mt-2 flex flex-wrap items-center justify-center gap-4">
          <Link
            to={ROUTES.PRICES}
            className="rounded-full border border-white/20 px-7 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
          >
            {t('premium.artistCtaPrices')}
          </Link>
          <Link
            to={ROUTES.REGISTRATION}
            className="rounded-full bg-[#C40505] px-7 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#a00404]"
          >
            {t('premium.artistCtaSignup')}
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Index;
