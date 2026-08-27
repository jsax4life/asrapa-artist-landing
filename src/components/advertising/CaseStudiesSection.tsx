import React from 'react';
import { useTranslation } from 'react-i18next';

const CaseStudiesSection: React.FC = () => {
  const { t } = useTranslation();
  const brand = t('brand');

  const caseStudies = [
    {
      titleKey: 'advertising.colgateTitle',
      descKey: 'advertising.colgateDesc',
      image: 'https://images.unsplash.com/photo-1620916560348-5933a3490aec?w=600&q=80',
      imageAlt: 'Colgate Supreme toothpaste product',
    },
    {
      titleKey: 'advertising.cocaColaTitle',
      descKey: 'advertising.cocaColaDesc',
      image: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=600&q=80',
      imageAlt: 'Coca-Cola glass with ice',
    },
  ];

  return (
    <section className="w-full max-w-6xl mx-auto px-6 py-20">
      <h2 className="text-3xl md:text-4xl font-bold text-white mb-16">{t('advertising.caseStudies')}</h2>

      <div className="flex flex-col gap-20">
        {caseStudies.map((study, index) => (
          <article
            key={study.titleKey}
            className={`flex flex-col md:flex-row items-center gap-10 ${
              index % 2 === 1 ? 'md:flex-row-reverse' : ''
            }`}
          >
            <div className="flex-1">
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 leading-snug">
                {t(study.titleKey)}
              </h3>
              <p className="text-[#D2D8DA] text-base leading-relaxed">
                {t(study.descKey, { brand })}
              </p>
            </div>
            <div className="flex-1 w-full max-w-md">
              <img
                src={study.image}
                alt={study.imageAlt}
                className="w-full h-64 md:h-72 object-cover rounded-lg"
              />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default CaseStudiesSection;
