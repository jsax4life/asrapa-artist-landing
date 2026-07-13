import React from 'react';

export const HeroSection: React.FC = () => {
  return (
    <section className="w-full max-w-[1300px] flex flex-col md:flex-row items-center md:items-start relative mx-auto py-10 px-2 md:py-20 md:px-0 gap-8 md:gap-8 lg:gap-12 pb-10 md:pb-16">
      <div className="w-full flex justify-center md:justify-start mb-8 md:mb-0 md:max-w-[320px] lg:max-w-[340px]">
        <img
          src="https://api.builder.io/api/v1/image/assets/TEMP/d190789592ebec35792a869f839c234ffd3b357b?width=720"
          alt="Music player interface showing artist content"
          className="w-[220px] h-[400px] xs:w-[160px] xs:h-[290px] sm:w-[200px] sm:h-[360px] md:w-[240px] md:h-[500px] lg:w-[280px] lg:h-[600px] shrink-0 shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] block"
        />
      </div>
      
      <div className="flex flex-col items-center md:items-start gap-6 md:gap-6 lg:gap-8 w-full md:w-2/3 max-w-full md:max-w-[700px]">
        <header className="w-full text-white text-center md:text-left text-2xl xs:text-xl sm:text-3xl md:text-4xl lg:text-5xl font-black leading-tight tracking-tight">
          <h1>
            <span className="font-normal text-2xl xs:text-xl sm:text-3xl md:text-5xl text-white">
              Why choose{' '}
            </span>
            <span className="font-normal text-2xl xs:text-xl sm:text-3xl md:text-5xl text-[rgba(196,5,5,1)]">
              Asrapa Music Artists
            </span>
            <span className="font-normal text-2xl xs:text-xl sm:text-3xl md:text-5xl text-white">
              ?
            </span>
          </h1>
        </header>
        
        <div className="w-full text-base xs:text-sm sm:text-base md:text-lg text-[#D2D8DA] font-normal leading-relaxed md:leading-[38px] tracking-[0.4px]">
          <section className="mb-6 sm:mb-8">
            <h2 className="font-bold text-white mb-2 sm:mb-4 text-lg sm:text-xl md:text-2xl">
              Unlimited distribution worldwide
            </h2>
            <p className="font-normal text-[rgba(210,216,218,1)] text-sm sm:text-base">
              Distribute your music on more than 150 digital platforms and on social networks in more than 200 countries.
            </p>
          </section>
          
          <section className="mb-6 sm:mb-8">
            <h2 className="font-bold text-white mb-2 sm:mb-4 text-lg sm:text-xl md:text-2xl">
              Keep 100% of your income
            </h2>
            <p className="font-normal text-[rgba(210,216,218,1)] text-sm sm:text-base">
              Asrapa Music for artists never takes commission on your streaming and download revenues from the Chadian digital platform Asrapa Music: you pocket what you generate.
            </p>
          </section>
          
          <section>
            <h2 className="font-bold text-white mb-2 sm:mb-4 text-lg sm:text-xl md:text-2xl">
              Detailed sales reports
            </h2>
            <p className="font-normal text-[rgba(210,216,218,1)] text-sm sm:text-base">
              Find out where your fans download and listen to your music to target your marketing and plan your tours accordingly.
            </p>
          </section>
        </div>
      </div>
    </section>
  );
};