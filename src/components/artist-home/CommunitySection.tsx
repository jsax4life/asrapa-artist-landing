import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ArtistCard } from './ArtistCard';
import ramajiPhoto from '@/assets/images/testimonial-ramaji.jpg';
import rockyPhoto from '@/assets/images/testimonial-rocky.jpg';
import ghisBeatPhoto from '@/assets/images/testimonial-ghis-beat.jpg';
import deboraPhoto from '@/assets/images/testimonial-debora.jpg';

const artists = [
  {
    id: 1,
    name: 'Ramaji',
    role: 'Artiste, Tchad',
    imageUrl: ramajiPhoto,
    imageAlt: 'Ramaji, artiste, Tchad',
    quote:
      "AsraPa est une plateforme pensée pour nous, les artistes tchadiens. Elle nous permet de mieux promouvoir notre musique, de toucher un public au Tchad comme dans la diaspora, et de renforcer le lien avec nos fans.",
  },
  {
    id: 2,
    name: 'Rocky La Citadelle',
    role: 'Artiste, Tchad',
    imageUrl: rockyPhoto,
    imageAlt: 'Rocky La Citadelle, artiste, Tchad',
    quote:
      "Avec AsraPa, la musique tchadienne a enfin un espace qui lui est entièrement dédié. La plateforme donne aux artistes une plus grande visibilité et à nos œuvres la reconnaissance qu'elles méritent.",
  },
  {
    id: 3,
    name: 'Ghis Beat',
    role: 'Ingénieur du son, Tchad',
    imageUrl: ghisBeatPhoto,
    imageAlt: 'Ghis Beat, ingénieur du son, Tchad',
    quote:
      "En tant qu'ingénieur du son, AsraPa représente une belle opportunité de mettre en valeur tout le travail derrière chaque morceau et d'encourager une musique de meilleure qualité.",
  },
  {
    id: 4,
    name: 'Debora Edih Ngaba',
    role: 'Abonnée, Diaspora',
    imageUrl: deboraPhoto,
    imageAlt: 'Debora Edih Ngaba, abonnée AsraPa',
    quote:
      "Vivre à l'étranger m'éloigne parfois de ma culture et de la musique de chez moi. Grâce à AsraPa, je retrouve les artistes tchadiens que j'aime et je découvre de nouvelles chansons. Chaque écoute me rapproche du Tchad et me permet de rester connectée à mes racines, où que je sois.",
  },
];

export const CommunitySection: React.FC = () => {
  const { t } = useTranslation();
  const [activeId, setActiveId] = useState<number | null>(null);

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
        aria-label="Artist community showcase"
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
