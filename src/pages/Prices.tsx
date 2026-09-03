import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Check, Mic2, Podcast, Radio, Sparkles } from 'lucide-react';
import { ROUTES } from '@/constants/routes';

const WHATSAPP_URL =
  'https://wa.me/23587509191?text=Bonjour%20AsraPa%2C%20je%20souhaite%20des%20informations%20sur%20les%20tarifs.';

type MusicTier = {
  id: 'labelled' | 'independent';
  name: string;
  tagline: string;
  highlight: boolean;
  rows: { label: string; price: string }[];
  steps: string[];
};

const MUSIC_TIER_ORDER: MusicTier['id'][] = ['independent', 'labelled'];
const MUSIC_TIER_HIGHLIGHT: Record<MusicTier['id'], boolean> = {
  independent: true,
  labelled: false,
};

const CONTENT_PLAN_ORDER = ['radio', 'podcast', 'sketches'] as const;
type ContentPlanId = (typeof CONTENT_PLAN_ORDER)[number];

const CONTENT_PLAN_ICONS: Record<ContentPlanId, typeof Radio> = {
  radio: Radio,
  podcast: Podcast,
  sketches: Mic2,
};

const CONTENT_PLAN_CTA: Record<ContentPlanId, { href: string; external: boolean }> = {
  radio: { href: WHATSAPP_URL, external: true },
  podcast: { href: ROUTES.REGISTRATION, external: false },
  sketches: { href: ROUTES.REGISTRATION, external: false },
};

const Prices = () => {
  const { t } = useTranslation();
  const [activeTier, setActiveTier] = useState<MusicTier['id']>('independent');

  const musicTiers: MusicTier[] = MUSIC_TIER_ORDER.map((id) => ({
    id,
    name: t(`pricesPage.musicTiers.${id}.name`),
    tagline: t(`pricesPage.musicTiers.${id}.tagline`),
    highlight: MUSIC_TIER_HIGHLIGHT[id],
    rows: t(`pricesPage.musicTiers.${id}.rows`, { returnObjects: true }) as { label: string; price: string }[],
    steps: t(`pricesPage.musicTiers.${id}.steps`, { returnObjects: true }) as string[],
  }));

  const contentPlans = CONTENT_PLAN_ORDER.map((id) => ({
    id,
    icon: CONTENT_PLAN_ICONS[id],
    name: t(`pricesPage.otherContent.${id}.name`),
    price: t(`pricesPage.otherContent.${id}.price`),
    detail: t(`pricesPage.otherContent.${id}.detail`),
    steps: t(`pricesPage.otherContent.${id}.steps`, { returnObjects: true }) as string[],
    cta: {
      label: t(`pricesPage.otherContent.${id}.ctaLabel`),
      href: CONTENT_PLAN_CTA[id].href,
      external: CONTENT_PLAN_CTA[id].external,
    },
  }));

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-5xl px-4 py-20 sm:px-6">
        <header className="text-center">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#C40505]">{t('pricesPage.eyebrow')}</p>
          <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
            {t('pricesPage.title')}
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-white/60">
            {t('pricesPage.subtitle')}
          </p>
        </header>

        {/* Music tiers */}
        <section className="mt-14">
          <div className="mx-auto flex w-fit rounded-full border border-white/10 bg-white/5 p-1">
            {musicTiers.map((tier) => (
              <button
                key={tier.id}
                type="button"
                onClick={() => setActiveTier(tier.id)}
                className={`rounded-full px-5 py-2 text-sm font-semibold transition-colors ${
                  activeTier === tier.id
                    ? 'bg-[#C40505] text-white'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                {tier.name}
              </button>
            ))}
          </div>

          {musicTiers
            .filter((tier) => tier.id === activeTier)
            .map((tier) => (
              <div
                key={tier.id}
                className="mx-auto mt-8 max-w-2xl rounded-3xl border border-white/10 bg-[#0d0d0d] p-8 sm:p-10"
              >
                <div className="flex items-center gap-2 text-[#C40505]">
                  <Sparkles className="size-5" />
                  <span className="text-xs font-semibold uppercase tracking-[0.2em]">
                    {tier.name}
                  </span>
                </div>
                <p className="mt-2 text-white/60">{tier.tagline}</p>

                <div className="mt-8 divide-y divide-white/10">
                  {tier.rows.map((row) => (
                    <div key={row.label} className="flex items-center justify-between py-4">
                      <span className="text-white/80">{row.label}</span>
                      <span className="text-lg font-bold">{row.price}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-8">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
                    {t('pricesPage.howToAccess')}
                  </p>
                  <ol className="mt-3 space-y-2">
                    {tier.steps.map((step, i) => (
                      <li key={step} className="flex items-start gap-3 text-sm text-white/70">
                        <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-[#C40505] text-[11px] font-bold text-white">
                          {i + 1}
                        </span>
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>

                <Link
                  to={ROUTES.REGISTRATION}
                  className="mt-8 flex w-full items-center justify-center gap-2 rounded-full bg-[#C40505] py-3.5 font-bold text-white transition-colors hover:bg-[#a00404]"
                >
                  <Check className="size-4" />
                  {t('pricesPage.createAccountCta')}
                </Link>
              </div>
            ))}
        </section>

        {/* Other content types */}
        <section className="mt-20">
          <h2 className="text-center text-2xl font-bold sm:text-3xl">{t('pricesPage.otherContent.title')}</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            {contentPlans.map((plan) => {
              const Icon = plan.icon;
              return (
                <div
                  key={plan.id}
                  className="flex flex-col rounded-2xl border border-white/10 bg-[#0d0d0d] p-6"
                >
                  <span className="grid size-10 place-items-center rounded-full bg-[#C40505]/15 text-[#C40505]">
                    <Icon className="size-5" />
                  </span>
                  <h3 className="mt-4 text-lg font-bold">{plan.name}</h3>
                  <p className="mt-1 text-2xl font-black">{plan.price}</p>
                  <p className="text-xs text-white/50">{plan.detail}</p>

                  <ol className="mt-5 flex-1 space-y-2">
                    {plan.steps.map((step, i) => (
                      <li key={step} className="flex items-start gap-2.5 text-xs text-white/60">
                        <span className="mt-0.5 grid size-4 shrink-0 place-items-center rounded-full bg-white/10 text-[10px] font-bold text-white/80">
                          {i + 1}
                        </span>
                        {step}
                      </li>
                    ))}
                  </ol>

                  {plan.cta.external ? (
                    <a
                      href={plan.cta.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-6 rounded-full border border-[#C40505] py-2.5 text-center text-sm font-semibold text-[#C40505] transition-colors hover:bg-[#C40505] hover:text-white"
                    >
                      {plan.cta.label}
                    </a>
                  ) : (
                    <Link
                      to={plan.cta.href}
                      className="mt-6 rounded-full border border-[#C40505] py-2.5 text-center text-sm font-semibold text-[#C40505] transition-colors hover:bg-[#C40505] hover:text-white"
                    >
                      {plan.cta.label}
                    </Link>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        <p className="mt-16 text-center text-xs text-white/40">
          {t('pricesPage.footer.question')}{' '}
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="text-[#C40505] hover:underline">
            {t('pricesPage.footer.contact')}
          </a>
          .
        </p>
      </div>
    </div>
  );
};

export default Prices;
