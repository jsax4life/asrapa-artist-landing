import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ROUTES } from '@/constants/routes';

type LabeledItem = { label: string; text: string };

const Terms = () => {
  const { t } = useTranslation();
  const brand = t('brand');

  const stringList = (key: string) =>
    t(key, { returnObjects: true }) as string[];

  const labeledList = (key: string) =>
    t(key, { returnObjects: true }) as LabeledItem[];

  return (
    <main className="min-h-screen bg-[#131313] text-white py-12 px-4 sm:px-8">
      <div className="max-w-3xl mx-auto">
        <Link
          to={ROUTES.REGISTRATION}
          className="inline-block text-sm text-[#C40505] hover:underline mb-8"
        >
          {t('terms.backToRegistration')}
        </Link>

        <article className="prose prose-invert max-w-none">
          <header className="mb-10 border-b border-white/10 pb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
              {t('terms.title')}
            </h1>
            <p className="text-[#D2D8DA] text-lg">
              {t('terms.subtitle', { brand })}
            </p>
          </header>

          <section className="space-y-8 text-[#D2D8DA] leading-relaxed">
            <div>
              <h2 className="text-xl font-bold text-white mb-3">
                {t('terms.preamble.title')}
              </h2>
              <p>{t('terms.preamble.p1', { brand })}</p>
              <p className="mt-3">{t('terms.preamble.p2')}</p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-white mb-3">
                {t('terms.article1.title')}
              </h2>
              <p>{t('terms.article1.p1')}</p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-white mb-3">
                {t('terms.article2.title')}
              </h2>
              <p>
                <strong className="text-white">2.1</strong> {t('terms.article2.s1')}
              </p>
              <p className="mt-3">
                <strong className="text-white">2.2</strong> {t('terms.article2.s2')}
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-white mb-3">
                {t('terms.article3.title')}
              </h2>
              <p>
                <strong className="text-white">3.1</strong> {t('terms.article3.s1')}
              </p>
              <p className="mt-3">
                <strong className="text-white">3.2</strong> {t('terms.article3.s2Intro')}
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                {stringList('terms.article3.s2Items').map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <p className="mt-3">
                <strong className="text-white">3.3</strong> {t('terms.article3.s3')}
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-white mb-3">
                {t('terms.article4.title')}
              </h2>
              <p>
                <strong className="text-white">4.1</strong> {t('terms.article4.s1Intro')}
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                {labeledList('terms.article4.s1Items').map((item) => (
                  <li key={item.label}>
                    <strong className="text-white">{item.label}</strong> {item.text}
                  </li>
                ))}
              </ul>
              <p className="mt-3">
                <strong className="text-white">4.2</strong> {t('terms.article4.s2Intro')}
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                {labeledList('terms.article4.s2Items').map((item) => (
                  <li key={item.label}>
                    <strong className="text-white">{item.label}</strong> {item.text}
                  </li>
                ))}
              </ul>
              <p className="mt-3">
                <strong className="text-white">4.3</strong> {t('terms.article4.s3')}
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-white mb-3">
                {t('terms.article5.title')}
              </h2>
              <p>{t('terms.article5.intro')}</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                {stringList('terms.article5.items').map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-bold text-white mb-3">
                {t('terms.article6.title')}
              </h2>
              <p>{t('terms.article6.intro')}</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                {stringList('terms.article6.items').map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-bold text-white mb-3">
                {t('terms.article7.title')}
              </h2>
              <p>
                <strong className="text-white">7.1</strong> {t('terms.article7.s1')}
              </p>
              <p className="mt-3">
                <strong className="text-white">7.2</strong> {t('terms.article7.s2')}
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-white mb-3">
                {t('terms.article8.title')}
              </h2>
              <p>
                <strong className="text-white">8.1</strong> {t('terms.article8.s1')}
              </p>
              <p className="mt-3">
                <strong className="text-white">8.2</strong> {t('terms.article8.s2')}
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-white mb-3">
                {t('terms.article9.title')}
              </h2>
              <p>{t('terms.article9.p1')}</p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-white mb-3">
                {t('terms.article10.title')}
              </h2>
              <p>
                <strong className="text-white">10.1</strong> {t('terms.article10.s1')}
              </p>
              <p className="mt-3">
                <strong className="text-white">10.2</strong> {t('terms.article10.s2')}
              </p>
            </div>
          </section>
        </article>
      </div>
    </main>
  );
};

export default Terms;
