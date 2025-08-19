import React from 'react';

interface ArtistCardProps {
  name: string;
  imageUrl: string;
  imageAlt: string;
  className?: string;
}

export const ArtistCard: React.FC<ArtistCardProps> = ({ 
  name, 
  imageUrl, 
  imageAlt, 
  className = "" 
}) => {
  return (
    <article 
      className={`w-[250px] h-[350px] relative shrink-0 bg-white rounded-[10px] max-md:w-[200px] max-md:h-[280px] max-sm:w-[150px] max-sm:h-[210px] ${className}`}
    >
      <img
        src={imageUrl}
        alt={imageAlt}
        className="flex w-[372px] h-[434px] justify-center items-center gap-[11.553px] shrink-0 shadow-[0_6.932px_28.882px_0_rgba(196,5,5,0.08)] absolute left-[-61px] top-[-71px] max-md:w-[298px] max-md:h-[347px] max-md:left-[-49px] max-md:top-[-57px] max-sm:w-[223px] max-sm:h-[260px] max-sm:left-[-37px] max-sm:top-[-43px]"
      />
      <div className="w-[250px] h-[355px] shrink-0 mix-blend-darken absolute bg-[#D9D9D9] left-0 -top-0.5 max-md:w-[200px] max-md:h-[284px] max-sm:w-[150px] max-sm:h-[213px]" />
      <h3 className="text-white text-lg font-bold leading-6 tracking-[0.18px] absolute h-6 left-4 top-[312px] max-md:top-[250px] max-sm:text-sm max-sm:top-[180px]">
        {name}
      </h3>
    </article>
  );
};