import React, { useState } from 'react';
import { ArtistCard } from './ArtistCard';

const artists = [
  {
    id: 1,
    name: "Fave",
    imageUrl: "https://api.builder.io/api/v1/image/assets/TEMP/ddf342161a6d72bc00f7f868176d3e5b76f9d209?width=744",
    imageAlt: "Fave artist profile"
  },
  {
    id: 2,
    name: "Djerabe",
    imageUrl: "https://api.builder.io/api/v1/image/assets/TEMP/1c153bcb77319c1c8d601ebf69bebef5b9184bb3?width=644",
    imageAlt: "Djerabe artist profile"
  },
  {
    id: 3,
    name: "Starr Fave",
    imageUrl: "https://api.builder.io/api/v1/image/assets/TEMP/aac56d7e4740c1dcfccc54083a4e51e1fdf5fc37?width=736",
    imageAlt: "Starr Fave artist profile"
  },
  {
    id: 4,
    name: "Niniola",
    imageUrl: "https://api.builder.io/api/v1/image/assets/TEMP/ce2f2692a7e69877d2242296ec45935edb4a9ffc?width=644",
    imageAlt: "Niniola artist profile"
  },
  {
    id: 5,
    name: "Fave",
    imageUrl: "https://api.builder.io/api/v1/image/assets/TEMP/ddf342161a6d72bc00f7f868176d3e5b76f9d209?width=744",
    imageAlt: "Fave artist profile"
  },
  {
    id: 6,
    name: "Starr Fave",
    imageUrl: "https://api.builder.io/api/v1/image/assets/TEMP/aac56d7e4740c1dcfccc54083a4e51e1fdf5fc37?width=736",
    imageAlt: "Starr Fave artist profile"
  },
  {
    id: 7,
    name: "Niniola",
    imageUrl: "https://api.builder.io/api/v1/image/assets/TEMP/ce2f2692a7e69877d2242296ec45935edb4a9ffc?width=644",
    imageAlt: "Niniola artist profile"
  }
];

export const CommunitySection: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const totalPages = 2;

  const handlePageChange = (pageIndex: number) => {
    setCurrentPage(pageIndex);
  };

  return (
    <section className="w-full max-w-[1482px] min-h-[523px] shrink-0 relative mt-[10px] mb-8 lg:mb-20 mx-auto px-2 sm:px-4">
      <header className="w-full flex justify-center items-center pt-4 pb-2">
        <h2 className="font-bold text-white text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-tight tracking-tight text-center max-w-full">
          Our community of artists
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
        {artists.map((artist, index) => (
          <div
            key={artist.id}
            className="snap-start flex-shrink-0"
          >
            <ArtistCard
              name={artist.name}
              imageUrl={artist.imageUrl}
              imageAlt={artist.imageAlt}
              className={index === 2 ? "mix-blend-multiply" : index === 6 ? "mix-blend-multiply" : ""}
            />
          </div>
        ))}
      </div>
      
      <nav
        className="flex justify-center items-center gap-[5px] mt-4"
        aria-label="Artist showcase pagination"
      >
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            onClick={() => handlePageChange(index)}
            className={`h-2.5 rounded-[100px] transition-all duration-200 ${
              index === currentPage 
                ? "w-5 bg-[#C40505]" 
                : "w-2.5 bg-[#D9D9D9] hover:bg-[#C40505]"
            }`}
            aria-label={`Go to page ${index + 1}`}
            aria-current={index === currentPage ? "page" : undefined}
          />
        ))}
      </nav>
    </section>
  );
};