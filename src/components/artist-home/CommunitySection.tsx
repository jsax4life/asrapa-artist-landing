import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ArtistCard } from './ArtistCard';
import ramajiPhoto from '@/assets/images/testimonial-ramaji.jpg';
import rockyPhoto from '@/assets/images/testimonial-rocky.jpg';
import ghisBeatPhoto from '@/assets/images/testimonial-ghis-beat.jpg';
import deboraPhoto from '@/assets/images/testimonial-debora.jpg';

export const CommunitySection: React.FC = () => {
  const { t } = useTranslation();
  const [activeId, setActiveId] = useState<number | null>(null);

  const artists = [
    {
      id: 1,
      name: 'Ramaji',
      role: t('community.artists.ramaji.role'),
      imageUrl: ramajiPhoto,
      imageAlt: t('community.artists.ramaji.imageAlt'),
      quote: t('community.artists.ramaji.quote'),
    },
    {
      id: 2,
      name: 'Rocky La Citadelle',
      role: t('community.artists.rocky.role'),
      imageUrl: rockyPhoto,
      imageAlt: t('community.artists.rocky.imageAlt'),
      quote: t('community.artists.rocky.quote'),
    },
    {
      id: 3,
      name: 'Ghis Beat',
      role: t('community.artists.ghisBeat.role'),
      imageUrl: ghisBeatPhoto,
      imageAlt: t('community.artists.ghisBeat.imageAlt'),
      quote: t('community.artists.ghisBeat.quote'),
    },
    {
      id: 4,
      name: 'Debora Edih Ngaba',
      role: t('community.artists.debora.role'),
      imageUrl: deboraPhoto,
      imageAlt: t('community.artists.debora.imageAlt'),
      quote: t('community.artists.debora.quote'),
    },
  ];

  return (
    <section className="w-full max-w-[1482px] min-h-[523px] shrink-0 relative mt-[10px] mb-8 lg:mb-20 mx-auto px-2 sm:px-4">
      <header className="w-full flex justify-center items-center pt-4 pb-2">
        <h2 className="font-bold text-white text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-tight tracking-tight text-center max-w-full">
          {t('community.title')}
        </h2>
      </header>

      <div
        className="flex flex-wrap justify-center gap-6 sm:gap-8 py-6"
        role="region"
        aria-label={t('community.showcaseAria')}
      >
        {artists.map((artist) => (
          <ArtistCard
            key={artist.id}
            name={artist.name}
            role={artist.role}
            quote={artist.quote}
            imageUrl={artist.imageUrl}
            imageAlt={artist.imageAlt}
            isActive={activeId === artist.id}
            isDimmed={activeId !== null && activeId !== artist.id}
            onHover={() => setActiveId(artist.id)}
            onLeave={() => setActiveId(null)}
          />
        ))}
      </div>
    </section>
  );
};
