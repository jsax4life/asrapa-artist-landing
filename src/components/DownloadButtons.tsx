import React from 'react';
import { useTranslation } from 'react-i18next';

const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.asrapa.music';
const APP_STORE_URL = 'https://apps.apple.com/app/asrapa-music';

function getStoreUrl(userAgent = typeof navigator !== 'undefined' ? navigator.userAgent : '') {
  const ua = userAgent.toLowerCase();
  if (/iphone|ipad|ipod|mac os x|macintosh/.test(ua)) return APP_STORE_URL;
  return PLAY_STORE_URL;
}

const DownloadButtons: React.FC = () => {
  const { t } = useTranslation();
  const brand = t('brand');

  const handleDownloadClick = () => {
    window.open(getStoreUrl(), '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="flex items-start gap-[34px] max-md:flex-col max-md:gap-6 max-md:items-center max-sm:w-full">
      <button
        onClick={handleDownloadClick}
        className="flex items-center gap-3 border cursor-pointer transition-all duration-[0.3s] ease-[ease] px-4 py-2 rounded-[50px] border-solid border-white hover:bg-white hover:text-black max-sm:w-full max-sm:justify-center"
        aria-label={t('about.downloadAppAria', { brand })}
      >
        <span className="text-white text-base font-bold leading-6 tracking-[0.16px] uppercase m-0 hover:text-black transition-colors">
          {t('common.downloadApp')}
        </span>
        <div>
          <div
            dangerouslySetInnerHTML={{
              __html:
                "<svg id=\"813:22488\" width=\"36\" height=\"36\" viewBox=\"0 0 36 36\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" class=\"arrow-icon\" style=\"width: 36px; height: 36px; border-radius: 50px; background: #FFF\"> <rect width=\"36\" height=\"36\" rx=\"18\" fill=\"white\"></rect> <path d=\"M10.9888 25.0102L25.0096 10.9894M25.0096 10.9894L17.6406 10.9356M25.0096 10.9894L25.0634 18.3584\" stroke=\"black\" stroke-width=\"1.25\"></path> </svg>",
            }}
          />
        </div>
      </button>
      <div className="flex items-start gap-[13.719px] max-md:flex-col max-md:gap-4">
        <a
          href={PLAY_STORE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="border-0 bg-transparent p-0 cursor-pointer"
          aria-label="Get it on Google Play"
        >
          <img
            src="https://api.builder.io/api/v1/image/assets/TEMP/086e1ac2cd4ccc3eef3684f40324c15e8db95b0f?width=377"
            alt="Get it on Google Play"
            className="w-[189px] h-[55px] border cursor-pointer transition-all duration-[0.3s] ease-[ease] rounded-[8.733px] border-solid border-white hover:opacity-80 max-sm:w-full max-sm:max-w-[250px]"
          />
        </a>
        <a
          href={APP_STORE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="border-0 bg-transparent p-0 cursor-pointer"
          aria-label="Download on the App Store"
        >
          <img
            src="https://api.builder.io/api/v1/image/assets/TEMP/4bd8bbc541f2d61d2d681532b53496ea229992fc?width=377"
            alt="Download on the App Store"
            className="w-[189px] h-[55px] border cursor-pointer transition-all duration-[0.3s] ease-[ease] rounded-[8.733px] border-solid border-white hover:opacity-80 max-sm:w-full max-sm:max-w-[250px]"
          />
        </a>
      </div>
    </div>
  );
};

export default DownloadButtons;
