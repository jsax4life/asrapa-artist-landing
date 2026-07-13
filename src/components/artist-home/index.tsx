import React from 'react';
import { HeroSection } from './HeroSection';
import { CommunitySection } from './CommunitySection';
import artistHomeImage from '../../assets/images/artist-home.png'


const Index = () => {
  return (
    <main className="w-full  m-0 p-0">
         <div className="relative h-[95vh] min-h-[650px] w-full">
    <img
      src={artistHomeImage}
      alt="Music background"
      className="absolute inset-0 h-full w-full object-cover"
    />
    <div className="absolute inset-0 bg-black bg-opacity-10 flex items-center justify-center">
      <div className="text-center mt-40">
        <h1 className="text-white text-4xl sm:text-5xl md:text-6xl font-extrabold mb-4 drop-shadow-lg">
          Sell your music to the whole world
        </h1>
        <p className="text-white text-base sm:text-lg md:text-xl font-normal mb-8 max-w-2xl mx-auto drop-shadow">
          Share your sound with fans everywhere. Asrapa Music empowers artists to distribute their music globally, reach new audiences, and keep 100% of their earnings. Join our community and let your music be heard across the world.
        </p>
        <a
          href="/registration"
          className="inline-block px-8 py-3 bg-[#C40505] text-white text-lg font-bold rounded-full shadow-lg hover:bg-[#a30404] transition-colors duration-200"
        >
          register
        </a>
      </div>
    </div>
  </div>
      <HeroSection />
      <CommunitySection />
    </main>
  );
};

export default Index;