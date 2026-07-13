import React from 'react';

const phoneMockups = [
  {
    label: 'Full-screen video ad',
    content: (
      <div className="h-full bg-gradient-to-b from-[#1a1a2e] to-[#16213e] flex flex-col items-center justify-center p-2">
        <div className="w-full h-[70%] bg-[#C40505]/30 rounded-lg flex items-center justify-center">
          <span className="text-white text-[8px] font-bold text-center px-1">Your Brand Here</span>
        </div>
        <span className="text-white/60 text-[7px] mt-2">Sponsored</span>
      </div>
    ),
  },
  {
    label: 'Story ad',
    content: (
      <div className="h-full bg-black flex flex-col">
        <div className="flex-1 bg-gradient-to-br from-purple-900 to-[#C40505] flex items-end p-2">
          <div className="bg-black/50 rounded px-2 py-1 w-full">
            <span className="text-white text-[7px] font-bold">Brand Campaign</span>
          </div>
        </div>
      </div>
    ),
  },
  {
    label: 'In-feed ad',
    content: (
      <div className="h-full bg-[#121212] p-2 flex flex-col gap-1">
        <div className="text-white text-[8px] font-bold mb-1">Home</div>
        <div className="flex gap-1 items-center bg-[#1e1e1e] rounded p-1">
          <div className="w-6 h-6 bg-[#C40505] rounded shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="text-white text-[6px] font-bold truncate">Sponsored Track</div>
            <div className="text-[#888] text-[5px]">Ad · Brand Name</div>
          </div>
          <button className="bg-[#C40505] text-white text-[5px] px-1.5 py-0.5 rounded-full shrink-0">
            Get It
          </button>
        </div>
        <div className="flex gap-1 items-center p-1 opacity-50">
          <div className="w-6 h-6 bg-gray-600 rounded shrink-0" />
          <div className="text-white text-[6px]">Regular Track</div>
        </div>
      </div>
    ),
  },
  {
    label: 'Search ad',
    content: (
      <div className="h-full bg-[#121212] p-2 flex flex-col gap-1">
        <div className="bg-[#2a2a2a] rounded px-2 py-1 text-[#888] text-[7px]">Search...</div>
        <div className="bg-[#1e1e1e] rounded p-1 flex gap-1 items-center">
          <div className="w-8 h-8 bg-[#C40505]/40 rounded shrink-0" />
          <div>
            <div className="text-white text-[6px] font-bold">Sponsored Result</div>
            <div className="text-[#888] text-[5px]">Ad</div>
          </div>
        </div>
      </div>
    ),
  },
];

const AdPlacementSection: React.FC = () => {
  return (
    <section className="w-full max-w-6xl mx-auto px-6 py-16">
      <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-6">
        Ad Placement
      </h2>
      <p className="text-[#D2D8DA] text-center text-base md:text-lg mb-12 max-w-3xl mx-auto">
        Reach your audience where they listen. AsrapaMusic offers multiple ad formats — from
        full-screen video and audio spots to in-feed and search placements — so your brand
        stays visible throughout the listening experience.
      </p>

      <div className="flex flex-wrap justify-center gap-6 md:gap-8">
        {phoneMockups.map((mockup) => (
          <div key={mockup.label} className="flex flex-col items-center gap-3">
            <div className="w-[140px] sm:w-[160px] h-[280px] sm:h-[320px] bg-black rounded-[24px] border-4 border-[#333] overflow-hidden shadow-xl">
              <div className="w-full h-full">{mockup.content}</div>
            </div>
            <span className="text-[#888] text-sm">{mockup.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AdPlacementSection;
