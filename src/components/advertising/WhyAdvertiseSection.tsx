import React from 'react';
import { useTranslation } from 'react-i18next';

const WhyAdvertiseSection: React.FC = () => {
  const { t } = useTranslation();
  const brand = t('brand');

  return (
    <section className="w-full max-w-5xl mx-auto px-6 py-20 text-center">
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-8">
        {t('advertising.whyTitle', { brand })}
      </h2>
      <p className="text-[#D2D8DA] text-base md:text-lg leading-relaxed max-w-3xl mx-auto">
        {t('advertising.whyDesc', { brand })}
      </p>
    </section>
  );
};

export default WhyAdvertiseSection;
