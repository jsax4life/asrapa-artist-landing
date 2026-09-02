import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ArtistCard } from './ArtistCard';
import ramajiPhoto from '@/assets/images/testimonial-ramaji.jpg';
import rockyPhoto from '@/assets/images/testimonial-rocky.jpg';
import ghisBeatPhoto from '@/assets/images/testimonial-ghis-beat.jpg';

const artists = [
  {
    id: 1,
    name: "Ramaji",
    imageUrl: ramajiPhoto,
    imageAlt: "Ramaji, artiste, Tchad"
  },
  {
    id: 2,
    name: "Rocky La Citadelle",
    imageUrl: rockyPhoto,
    imageAlt: "Rocky La Citadelle, artiste, Tchad"
  },
  {
    id: 3,
    name: "Ghis Beat",
    imageUrl: ghisBeatPhoto,
    imageAlt: "Ghis Beat, ingénieur du son, Tchad"
  },
];

export const CommunitySection: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section className="w-full max-w-[1482px] min-h-[523px] shrink-0 relative mt-[10px] mb-8 lg:mb-20 mx-auto px-2 sm:px-4">
      <header className="w-full flex justify-center items-center pt-4 pb-2">
        <h2 className="font-bold text-white text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-tight tracking-tight text-center max-w-full">
          {t('community.title')}
        </h2>
      </header>
      
      <div
        className="
          flex 
          gap-4 
          sm:gap-6 
          w-full 
          overflow-x-auto 
          py-4 
          px-1
          scrollbar-thin scrollbar-thumb-[#C40505]/40 scrollbar-track-transparent
          snap-x snap-mandatory
          "
        role="region"
        aria-label="Artist community showcase"
      >
        {artists.map((artist) => (
          <div
            key={artist.id}
            className="snap-start flex-shrink-0"
          >
            <ArtistCard
              name={artist.name}
              imageUrl={artist.imageUrl}
              imageAlt={artist.imageAlt}
            />
          </div>
        ))}
      </div>
    </section>
  );
};