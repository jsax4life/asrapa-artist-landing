import React from 'react';
import { useTranslation } from 'react-i18next';
import ArticleCard from './ArticleCard';
import artistProfile from '@/assets/images/artist-profile.jpg';
import artistHome from '@/assets/images/artist-home.png';
import heroImage from '@/assets/images/hero.jpg';
import musicImage from '@/assets/images/music.png';

const ArticleGrid = () => {
  const { t } = useTranslation();
  const articles = [
    {
      image: artistProfile,
      title: t('articleGuidePage.article1.title'),
      description: t('articleGuidePage.article1.description'),
      body: t('articleGuidePage.article1.body', { returnObjects: true }) as string[],
      imageAspectRatio: "aspect-[1.79]",
      titleSize: "text-base",
      titleTracking: "tracking-[0.13px]",
      titleLeading: "leading-none",
      descriptionColor: "text-black/70",
      paddingBottom: "pb-1",
      minHeight: ""
    },
    {
      image: artistHome,
      title: t('articleGuidePage.article2.title'),
      description: t('articleGuidePage.article2.description'),
      body: t('articleGuidePage.article2.body', { returnObjects: true }) as string[],
      imageAspectRatio: "aspect-[1.96]",
      titleSize: "text-lg",
      titleTracking: "tracking-[-1px]",
      titleLeading: "leading-[1.4]",
      descriptionColor: "text-[rgba(102,102,102,1)]",
      paddingBottom: "pb-[46px]",
      minHeight: "h-[437px]"
    },
    {
      image: heroImage,
      title: t('articleGuidePage.article3.title'),
      description: t('articleGuidePage.article3.description'),
      body: t('articleGuidePage.article3.body', { returnObjects: true }) as string[],
      imageAspectRatio: "aspect-[1.86]",
      titleSize: "text-lg",
      titleTracking: "tracking-[-1px]",
      titleLeading: "leading-[25px]",
      descriptionColor: "text-[rgba(102,102,102,1)]",
      paddingBottom: "",
      minHeight: "h-[437px]"
    },
    {
      image: musicImage,
      title: t('articleGuidePage.article4.title'),
      description: t('articleGuidePage.article4.description'),
      body: t('articleGuidePage.article4.body', { returnObjects: true }) as string[],
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
    <main className="self-center z-10 flex mt-[-92px] w-full max-w-[1221px] gap-[30px] font-bold text-center flex-wrap justify-center max-md:max-w-full">
      {articles.map((article, index) => (
        <ArticleCard
          key={index}
          image={article.image}
          title={article.title}
          description={article.description}
          body={article.body}
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
