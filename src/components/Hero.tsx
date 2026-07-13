import React from 'react';

const Hero = () => {
  return (
    <section className="flex flex-col relative min-h-[502px] w-full items-stretch text-xl font-bold pb-36 max-md:max-w-full max-md:pb-[100px]">
      <img
        src="https://api.builder.io/api/v1/image/assets/e4fe701087e74a95b6a29ed12c1bd7bc/32f212dcfb38726935d12726b06ba0105f47ff8c?placeholderIfAbsent=true"
        alt="Hero background"
        className="absolute h-full w-full object-cover inset-0"
      />
      <div className="relative text-[#F6C874] leading-6 mb-[-29px] ml-[131px] mt-[141px] max-md:ml-2.5 max-md:mt-10 max-md:mb-2.5">
        <h1 className="text-[40px] leading-[44px] mb-2">
          AsrapaMusic
        </h1>
        <h2 className="text-[48px] leading-[52px]">
          ARTIST GUIDE
        </h2>
      </div>
    </section>
  );
};

export default Hero;
