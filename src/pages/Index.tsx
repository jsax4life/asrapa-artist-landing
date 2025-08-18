import React from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import ArticleGrid from '@/components/ArticleGrid';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="flex flex-col overflow-hidden items-stretch bg-[#2A2626]">
      <div className="flex flex-col relative min-h-[502px] w-full items-stretch text-xl font-bold pb-36 max-md:max-w-full max-md:pb-[100px]">
        <img
          src="https://api.builder.io/api/v1/image/assets/e4fe701087e74a95b6a29ed12c1bd7bc/32f212dcfb38726935d12726b06ba0105f47ff8c?placeholderIfAbsent=true"
          alt="Hero background"
          className="absolute h-full w-full object-cover inset-0"
        />
        <Header />
        <Hero />
      </div>
      <ArticleGrid />
      <Footer />
    </div>
  );
};

export default Index;
