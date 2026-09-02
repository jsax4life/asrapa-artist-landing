import React from 'react';
import { useTranslation } from 'react-i18next';
import { QRCodeSVG } from 'qrcode.react';
import asraPaIconMark from '@/assets/images/asrapa-icon-mark.png';

/** Lien direct vers la fiche Play Store, la plateforme dominante au Tchad. */
const APP_DOWNLOAD_URL = 'https://play.google.com/store/apps/details?id=com.asrapa.music';

const QRCodeSection: React.FC = () => {
  const { t } = useTranslation();
  const brand = t('brand');

  return (
    <section className="w-full py-24 relative flex flex-col items-center justify-center gap-10 bg-black max-sm:py-16 max-sm:px-5">
      <header>
        <h2 className="w-[900px] max-w-full text-white text-center text-5xl font-bold leading-[60px] tracking-[0.5px] m-0 max-md:text-4xl max-md:leading-[48px] max-md:px-5 max-sm:text-[32px] max-sm:leading-10">
          {t('about.scanDownload', { brand })}
        </h2>
      </header>

      <div className="rounded-3xl bg-white p-6 shadow-[0_20px_60px_rgba(196,5,5,0.2)]">
        <QRCodeSVG
          value={APP_DOWNLOAD_URL}
          size={220}
          bgColor="#ffffff"
          fgColor="#0a0a0a"
          level="H"
          imageSettings={{
            src: asraPaIconMark,
            height: 44,
            width: 44,
            excavate: true,
          }}
        />
      </div>
    </section>
  );
};

export default QRCodeSection;
