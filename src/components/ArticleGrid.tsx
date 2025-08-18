import React from 'react';
import ArticleCard from './ArticleCard';

const ArticleGrid = () => {
  const articles = [
    {
      image: "https://api.builder.io/api/v1/image/assets/e4fe701087e74a95b6a29ed12c1bd7bc/af57a713a22b26481224f7ab2315cd0bc653ea53?placeholderIfAbsent=true",
      title: "What Does an Artist Manager Do?",
      description: "We break down all the key aspects of being an artist manager.",
      imageAspectRatio: "aspect-[1.79]",
      titleSize: "text-base",
      titleTracking: "tracking-[0.13px]",
      titleLeading: "leading-none",
      descriptionColor: "text-[#666]",
      paddingBottom: "pb-1",
      minHeight: ""
    },
    {
      image: "https://api.builder.io/api/v1/image/assets/e4fe701087e74a95b6a29ed12c1bd7bc/2378dbb347059fd488555b7399a6c0339473786e?placeholderIfAbsent=true",
      title: "Music Publishing Deals, Explained",
      description: "We define some basic concepts in the music publishing business.",
      imageAspectRatio: "aspect-[1.96]",
      titleSize: "text-lg",
      titleTracking: "tracking-[-1px]",
      titleLeading: "leading-[1.4]",
      descriptionColor: "text-[rgba(102,102,102,1)]",
      paddingBottom: "pb-[46px]",
      minHeight: "h-[437px]"
    },
    {
      image: "https://api.builder.io/api/v1/image/assets/e4fe701087e74a95b6a29ed12c1bd7bc/be916505c80da08d2b734eb91461f15acb24c2c0?placeholderIfAbsent=true",
      title: "When & Why to Hire an Entertainment Attorney",
      description: "If there's money at play, it's time for an entertainment attorney.",
      imageAspectRatio: "aspect-[1.86]",
      titleSize: "text-lg",
      titleTracking: "tracking-[-1px]",
      titleLeading: "leading-[25px]",
      descriptionColor: "text-[rgba(102,102,102,1)]",
      paddingBottom: "",
      minHeight: "h-[437px]"
    },
    {
      image: "https://api.builder.io/api/v1/image/assets/e4fe701087e74a95b6a29ed12c1bd7bc/38c79cf55fc5e5757ecc3e1a56bfbff25bb6d728?placeholderIfAbsent=true",
      title: "How to Protect Yourself as a Songwriter or Producer",
      description: "Here's how to ensure your business goes smoothly, allowing you to control your rights and ensure you get paid…",
      imageAspectRatio: "aspect-[1.96]",
      titleSize: "text-lg",
      titleTracking: "tracking-[-1px]",
      titleLeading: "leading-[25px]",
      descriptionColor: "text-[rgba(102,102,102,1)]",
      paddingBottom: "",
      minHeight: "h-[437px]"
    },
    {
      image: "https://api.builder.io/api/v1/image/assets/e4fe701087e74a95b6a29ed12c1bd7bc/a13d9a4e4f5ad306ee8f2673dd78bde155f4ad8b?placeholderIfAbsent=true",
      title: "11 Rules for Protecting Yourself (& Your Music) Pre-Release",
      description: "Artists: make sure you're taking these key steps to ensuring your release goes according to plan.",
      imageAspectRatio: "aspect-[1.86]",
      titleSize: "text-lg",
      titleTracking: "tracking-[-1px]",
      titleLeading: "leading-[25px]",
      descriptionColor: "text-[rgba(102,102,102,1)]",
      paddingBottom: "",
      minHeight: "h-[437px]"
    },
    {
      image: "https://api.builder.io/api/v1/image/assets/e4fe701087e74a95b6a29ed12c1bd7bc/4098832d0175950bd419d89f2517e35d9a90497c?placeholderIfAbsent=true",
      title: "Branding, Marketing, Publicity, Promotion & Advertising: Explained",
      description: "Your artist guide to more effective marketing campaigns.",
      imageAspectRatio: "aspect-[1.96]",
      titleSize: "text-lg",
      titleTracking: "tracking-[-1px]",
      titleLeading: "leading-[25px]",
      descriptionColor: "text-[rgba(102,102,102,1)]",
      paddingBottom: "pb-[21px]",
      minHeight: "h-[437px]"
    },
    {
      image: "https://api.builder.io/api/v1/image/assets/e4fe701087e74a95b6a29ed12c1bd7bc/6d3360cd32411fd4786104f700814c316e754fd9?placeholderIfAbsent=true",
      title: "What Do Booking Agents Do?",
      description: "Let's break down booking agents, and how they make you money.",
      imageAspectRatio: "aspect-[1.78]",
      titleSize: "text-lg",
      titleTracking: "tracking-[-1px]",
      titleLeading: "leading-[1.4]",
      descriptionColor: "text-[rgba(102,102,102,1)]",
      paddingBottom: "pb-1",
      minHeight: "min-h-[437px]"
    },
    {
      image: "https://api.builder.io/api/v1/image/assets/e4fe701087e74a95b6a29ed12c1bd7bc/2ada942e9dfc66076ec83e7d51ff48ac34b1ee43?placeholderIfAbsent=true",
      title: "4 Music Publishing Revenue Streams: Explained",
      description: "Let's break down the four music publishing revenue streams.",
      imageAspectRatio: "aspect-[1.86]",
      titleSize: "text-lg",
      titleTracking: "tracking-[-1px]",
      titleLeading: "leading-[25px]",
      descriptionColor: "text-[rgba(102,102,102,1)]",
      paddingBottom: "",
      minHeight: "h-[437px]"
    },
    {
      image: "https://api.builder.io/api/v1/image/assets/e4fe701087e74a95b6a29ed12c1bd7bc/0be4c7cffcfdf0a0dd6c89fc1a721566005f101f?placeholderIfAbsent=true",
      title: "Chester Watson's 10-Step Guide to Creating a Concept Album",
      description: "The Florida rapper and producer breaks down his tips to making a good concept album.",
      imageAspectRatio: "aspect-[1.96]",
      titleSize: "text-lg",
      titleTracking: "tracking-[-1px]",
      titleLeading: "leading-[25px]",
      descriptionColor: "text-[rgba(102,102,102,1)]",
      paddingBottom: "pb-[21px]",
      minHeight: "h-[437px]"
    },
    {
      image: "https://api.builder.io/api/v1/image/assets/e4fe701087e74a95b6a29ed12c1bd7bc/650260d7404fedca05d346aff9d91b2e04bb183d?placeholderIfAbsent=true",
      title: "4 Recorded Music Revenue Streams: Explained",
      description: "Let's break down the four recorded music revenue streams.",
      imageAspectRatio: "aspect-[1.96]",
      titleSize: "text-lg",
      titleTracking: "tracking-[-1px]",
      titleLeading: "leading-[25px]",
      descriptionColor: "text-[rgba(102,102,102,1)]",
      paddingBottom: "pb-[21px]",
      minHeight: "h-[437px]"
    },
    {
      image: "https://api.builder.io/api/v1/image/assets/e4fe701087e74a95b6a29ed12c1bd7bc/44471c9b1cb4fc358da538a0c1aa83fceb53dd6e?placeholderIfAbsent=true",
      title: "Song Copyrights Explained: 'Musical Work' vs. 'Sound Recording'",
      description: "Everything you need to know about the two copyrights attached to a song.",
      imageAspectRatio: "aspect-[1.86]",
      titleSize: "text-lg",
      titleTracking: "tracking-[-1px]",
      titleLeading: "leading-[25px]",
      descriptionColor: "text-[rgba(102,102,102,1)]",
      paddingBottom: "",
      minHeight: "h-[437px]"
    },
    {
      image: "https://api.builder.io/api/v1/image/assets/e4fe701087e74a95b6a29ed12c1bd7bc/fbacbeaef7379917934e64533767b45a6ea7f503?placeholderIfAbsent=true",
      title: "The Ins & Outs of Managing Social Media as an Artist",
      description: "Digital Manager Olivia Shalhoup shares her top five tips for standing on social media, and much, much more.",
      imageAspectRatio: "aspect-[1.96]",
      titleSize: "text-lg",
      titleTracking: "tracking-[-1px]",
      titleLeading: "leading-[25px]",
      descriptionColor: "text-[rgba(102,102,102,1)]",
      paddingBottom: "",
      minHeight: "h-[437px]"
    }
  ];

  return (
    <main className="self-center z-10 flex mt-[-92px] w-full max-w-[1221px] gap-[30px] font-bold text-center flex-wrap max-md:max-w-full">
      {articles.map((article, index) => (
        <ArticleCard
          key={index}
          image={article.image}
          title={article.title}
          description={article.description}
          imageAspectRatio={article.imageAspectRatio}
          titleSize={article.titleSize}
          titleTracking={article.titleTracking}
          titleLeading={article.titleLeading}
          descriptionColor={article.descriptionColor}
          paddingBottom={article.paddingBottom}
          minHeight={article.minHeight}
        />
      ))}
    </main>
  );
};

export default ArticleGrid;
