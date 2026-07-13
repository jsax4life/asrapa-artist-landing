import React from 'react';
import HeroSection from './HeroSection';
import WhyAdvertiseSection from './WhyAdvertiseSection';
import AdPlacementSection from './AdPlacementSection';
import CaseStudiesSection from './CaseStudiesSection';
import GetStartedFormSection from './GetStartedFormSection';

const AdvertisingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <HeroSection />
      <WhyAdvertiseSection />
      <AdPlacementSection />
      <CaseStudiesSection />
      <GetStartedFormSection />
    </div>
  );
};

export default AdvertisingPage;
