import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface ArticleCardProps {
  image: string;
  title: string;
  description: string;
  body?: string[];
  imageAspectRatio?: string;
  titleSize?: string;
  titleTracking?: string;
  titleLeading?: string;
  descriptionColor?: string;
  paddingBottom?: string;
  minHeight?: string;
}

const ArticleCard: React.FC<ArticleCardProps> = ({
  image,
  title,
  description,
  body = [],
  imageAspectRatio = "aspect-[1.79]",
  titleSize = "text-base",
  titleTracking = "tracking-[0.13px]",
  titleLeading = "leading-none",
  descriptionColor = "text-[#666]",
  paddingBottom = "pb-1",
  minHeight = ""
}) => {
  return (
    <Dialog>
      <article className={`bg-white shadow-[0px_20px_20px_rgba(0,0,0,0.04)] flex min-w-60 ${minHeight} flex-col overflow-hidden items-center tracking-[-0.5px] justify-center grow shrink w-[310px] ${paddingBottom} rounded-lg`}>
        <div className="max-w-full w-[389px]">
          <img
            src={image}
            alt={title}
            className={`${imageAspectRatio} object-contain w-full`}
          />
          <div className="w-full p-8 max-md:px-5">
            <header className={`flex w-full flex-col items-center ${titleSize} text-black ${titleTracking} ${titleLeading} pl-[26px] pr-[25px] max-md:px-5`}>
              <h3>{title}</h3>
            </header>
            <div className={`text-sm ${descriptionColor} font-normal tracking-[-0.15px] leading-5 pt-1 pb-6`}>
              <div className="flex flex-col items-center pl-[5px] pr-1">
                <p>{description}</p>
              </div>
            </div>
            <div className="flex min-h-[59px] flex-col items-center text-[13px] text-white uppercase tracking-[-0.5px] leading-none justify-center px-[84px] max-md:px-5">
              <DialogTrigger asChild>
                <button
                  type="button"
                  className="items-center border shadow-[0_4px_4px_0_rgba(0,0,0,0.05)] flex flex-col justify-center bg-[#C40505] px-10 py-[17px] rounded-[50px] border-solid border-[#C40505] max-md:px-5 hover:bg-[#A00404] transition-colors focus:outline-none focus:ring-2 focus:ring-[#C40505] focus:ring-offset-2"
                  aria-label={`Lire l'article : ${title}`}
                >
                  <span>Lire la suite</span>
                </button>
              </DialogTrigger>
            </div>
          </div>
        </div>
      </article>
      <DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto bg-white text-black">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-black">{title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 text-[15px] leading-relaxed text-[#333]">
          {body.length > 0 ? (
            body.map((paragraph, i) => <p key={i}>{paragraph}</p>)
          ) : (
            <p>{description}</p>
          )}
        </div>
        <p className="mt-6 text-xs font-semibold tracking-[0.15em] text-[#C40505] uppercase">
          AsraPa · Un Son, Une Identité, Un Peuple.
        </p>
      </DialogContent>
    </Dialog>
  );
};

export default ArticleCard;
