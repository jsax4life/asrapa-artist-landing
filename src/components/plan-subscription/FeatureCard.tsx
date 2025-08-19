import React from 'react';

interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => {
  return (
    <article className="flex flex-col items-center gap-9 w-[318px] max-md:w-[280px] max-sm:w-full max-sm:max-w-[300px]">
      <div>
        <div
          dangerouslySetInnerHTML={{
            __html: icon,
          }}
        />
      </div>
      <div className="flex flex-col items-center gap-3 w-full">
        <h3 className="text-white text-center text-[22px] font-bold leading-[33px] max-sm:text-xl">
          {title}
        </h3>
        <p className="text-white text-center text-base font-normal leading-6 max-sm:text-sm">
          {description}
        </p>
      </div>
    </article>
  );
};
