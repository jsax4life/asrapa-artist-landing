import React from 'react';

interface ArtistCardProps {
  name: string;
  role: string;
  quote: string;
  imageUrl: string;
  imageAlt: string;
  isActive: boolean;
  isDimmed: boolean;
  onHover: () => void;
  onLeave: () => void;
}

export const ArtistCard: React.FC<ArtistCardProps> = ({
  name,
  role,
  quote,
  imageUrl,
  imageAlt,
  isActive,
  isDimmed,
  onHover,
  onLeave,
}) => {
  return (
    <article
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      onFocus={onHover}
      onBlur={onLeave}
      tabIndex={0}
      className={`group relative h-[380px] w-[250px] shrink-0 overflow-hidden rounded-2xl bg-black outline-none transition-all duration-500 ease-out max-md:h-[300px] max-md:w-[210px] max-sm:h-[240px] max-sm:w-[170px] ${
        isActive
          ? 'z-20 -translate-y-3 scale-105 shadow-[0_20px_50px_rgba(196,5,5,0.35)] ring-2 ring-[#C40505]'
          : isDimmed
            ? 'z-0 scale-95 opacity-50'
            : 'z-10 opacity-100'
      }`}
    >
      <img
        src={imageUrl}
        alt={imageAlt}
        className={`absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out ${
          isActive ? 'scale-110' : 'scale-100'
        }`}
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

      <div
        className={`absolute inset-x-0 bottom-0 p-4 transition-all duration-500 ${
          isActive ? 'max-md:p-3' : ''
        }`}
      >
        <h3 className="text-lg font-bold leading-6 tracking-[0.18px] text-white max-sm:text-sm">
          {name}
        </h3>
        <p className="mt-0.5 text-xs font-medium text-[#C40505] uppercase tracking-[0.1em]">
          {role}
        </p>

        <p
          className={`overflow-hidden text-sm leading-relaxed text-white/90 transition-all duration-500 ease-out ${
            isActive ? 'mt-3 max-h-40 opacity-100' : 'mt-0 max-h-0 opacity-0'
          }`}
        >
          <span className="mr-1 text-[#C40505]">&laquo;</span>
          {quote}
          <span className="ml-1 text-[#C40505]">&raquo;</span>
        </p>
      </div>
    </article>
  );
};
