import React, { useState } from 'react';
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

const musicTiers: MusicTier[] = [
  {
    id: 'independent',
    name: 'Artistes indépendants',
    tagline: 'Vous produisez et distribuez seul.',
    highlight: true,
    rows: [
      { label: 'Titre (single)', price: '10 000 FCFA / an' },
      { label: 'EP', price: '30 000 FCFA' },
      { label: 'Album', price: '100 000 FCFA' },
    ],
    steps: [
      'Créez votre compte artiste.',
      'Choisissez le format à publier (titre, EP ou album).',
      'Réglez le tarif correspondant et envoyez vos fichiers.',
    ],
  },
  {
    id: 'labelled',
    name: 'Artistes labellisés',
    tagline: 'Vous êtes accompagné par un label ou un producteur.',
    highlight: false,
    rows: [
      { label: 'Titre (single)', price: '5 000 FCFA / an' },
      { label: 'EP', price: '15 000 FCFA' },
      { label: 'Album', price: '25 000 FCFA / an' },
    ],
    steps: [
      'Créez votre compte artiste (au nom du label ou du titulaire des droits).',
      'Renseignez les informations de votre label.',
      'Réglez le tarif correspondant et envoyez vos fichiers.',
    ],
  },
];

const contentPlans = [
  {
    id: 'radio',
    icon: Radio,
    name: 'Émissions radio',
    price: 'Sur devis',
    detail: 'Abonnement sur mesure',
    steps: [
      'Contactez-nous par WhatsApp.',
      'Décrivez votre émission et sa fréquence.',
      'Recevez votre devis personnalisé.',
    ],
    cta: { label: 'Demander un devis', href: WHATSAPP_URL, external: true },
  },
  {
    id: 'podcast',
    icon: Podcast,
    name: 'Podcast audio',
    price: '10 000 FCFA',
    detail: 'par épisode',
    steps: ['Créez votre compte créateur.', 'Téléversez votre épisode.', 'Réglez et publiez.'],
    cta: { label: 'Créer mon compte', href: ROUTES.REGISTRATION, external: false },
  },
  {
    id: 'sketches',
    icon: Mic2,
    name: 'Sketchs',
    price: '10 000 FCFA',
    detail: 'par épisode',
    steps: ['Créez votre compte créateur.', 'Téléversez votre épisode.', 'Réglez et publiez.'],
    cta: { label: 'Créer mon compte', href: ROUTES.REGISTRATION, external: false },
  },
];

const Prices = () => {
  const [activeTier, setActiveTier] = useState<MusicTier['id']>('independent');

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-5xl px-4 py-20 sm:px-6">
        <header className="text-center">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#C40505]">Tarifs</p>
          <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
            Diffusez votre contenu sur AsraPa.
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-white/60">
            Un tarif simple selon votre statut et votre contenu. Pas d'abonnement caché, pas de
            frais surprise.
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
                    Comment y accéder
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
                  Créer mon compte artiste
                </Link>
              </div>
            ))}
        </section>

        {/* Other content types */}
        <section className="mt-20">
          <h2 className="text-center text-2xl font-bold sm:text-3xl">Autres contenus</h2>
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
          Des questions sur les tarifs ?{' '}
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="text-[#C40505] hover:underline">
            Contactez-nous sur WhatsApp
          </a>
          .
        </p>
      </div>
    </div>
  );
};

export default Prices;
