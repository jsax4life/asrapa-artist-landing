import React from 'react';
import Hero from '@/components/Hero';
import ArticleGrid from '@/components/ArticleGrid';

const ArtistGuide = () => {
  return (
    <div className="flex flex-col overflow-hidden items-stretch">
      <Hero />
      <ArticleGrid />
    </div>
  );
};

export default ArtistGuide;
