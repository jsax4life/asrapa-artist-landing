import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import SpotifyIcon from './SpotifyIcon';

const QRCodeSection: React.FC = () => {
  const { t } = useTranslation();
  const brand = t('brand');
  const [email, setEmail] = useState('');

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Email submitted:', email);
    // Add email submission logic here
  };

  return (


    <section className="w-full h-[780px] p-8  relative flex flex-col items-center justify-center gap-[60px] bg-black  max-sm:h-auto max-sm:gap-10 max-sm:px-5 max-sm:py-[60px]">
      <header>
        <h2 className="w-[900px] text-white text-center text-5xl font-bold leading-[60px] tracking-[0.5px] m-0 max-md:w-full max-md:text-4xl max-md:leading-[48px] max-md:px-5 max-md:py-0 max-sm:text-[32px] max-sm:leading-10">
          {t('about.scanDownload', { brand })}
        </h2>
      </header>
      <div className="w-[420px] h-[530px] relative max-md:scale-[0.8] max-sm:scale-[0.6]">
        <img
          src="https://api.builder.io/api/v1/image/assets/TEMP/1ba1e2135b60ecf461876cf5521140b695cf7874?width=1032"
          alt={t('about.iphoneAlt', { brand })}
          className="w-[420px] h-[530px] absolute left-0 top-0"
        />
        <div className="w-[240px] h-[238px] absolute left-[90px] top-[217px]">
          <img
            src="https://api.builder.io/api/v1/image/assets/TEMP/78c2b74ee45f4afc01dfc61b6e4cf045956957e7?width=592"
            alt={t('about.qrAlt', { brand })}
            className="w-[240px] h-[238px] absolute rounded-3xl left-0 top-0"
          />
          <div className="flex w-[60px] h-[60px] justify-center items-center absolute bg-white p-[5.9px] rounded-[72.7px] left-[90px] top-[82px]">
            <SpotifyIcon />
          </div>
        </div>
      </div>
      <form onSubmit={handleEmailSubmit} className="flex flex-col items-center gap-4 max-sm:w-full max-sm:px-4">
        <label htmlFor="email-input" className="text-white text-lg font-medium">
          Get notified when we launch
        </label>
        <div className="flex gap-3 max-sm:flex-col max-sm:w-full">
          <input
            id="email-input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="px-4 py-2 rounded-lg border border-white bg-transparent text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white max-sm:w-full"
            required
            aria-label="Email address for notifications"
          />
          <button
            type="submit"
            className="px-6 py-2 bg-white text-black rounded-lg font-medium hover:bg-gray-200 transition-colors max-sm:w-full"
            aria-label="Submit email for notifications"
          >
            Notify Me
          </button>
        </div>
      </form>
    </section>
  );
};

export default QRCodeSection;
