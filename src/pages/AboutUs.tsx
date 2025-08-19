import React from 'react';
import musicImage from '@/assets/images/music.png';
import AboutHeroSection from '@/components/AboutHeroSection';
import QRCodeSection from '@/components/QRCodeSection';
import PlanSubscriptionSection from '@/components/plan-subscription/index';

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-[#2A2626] text-white">
      {/* Hero Header */}
      

      <AboutHeroSection />
      <QRCodeSection />

      <PlanSubscriptionSection />

  
    </div>
  );
};

export default AboutUs;
