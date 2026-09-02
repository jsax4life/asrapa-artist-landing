import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Facebook, Instagram } from 'lucide-react';
import { ROUTES } from '@/constants/routes';
import asraPaLogo from '@/assets/images/asrapa-logo-white.png';

const FACEBOOK_URL = 'https://www.facebook.com/profile.php?id=61593168059708';
const INSTAGRAM_URL = 'https://www.instagram.com/asrapa_chad?igsi=MTEycHR4c3RpanF0cw==';

const Footer = () => {
  const { t } = useTranslation();
  const brand = t('brand');

  const companyLinks = [{ labelKey: 'footer.about', href: '#about' }];

  const communityLinks = [
    { labelKey: 'footer.forArtists', href: '#artists' },
    { labelKey: 'nav.advertising', href: ROUTES.ADVERTISING, isRoute: true },
  ];

  const usefulLinks = [{ labelKey: 'footer.support', href: '#support' }];

  return (
    <footer className="bg-[rgba(18,18,18,1)] flex min-h-[487px] w-full flex-col items-center justify-center  px-2.5 py-[104px] max-md:max-w-full max-md:mt-10 max-md:pb-[100px]">
      <div className="flex w-[1344px] max-w-full gap-[40px_100px] justify-between flex-wrap">
        <img
          src={asraPaLogo}
          alt={t('footer.logoAlt', { brand })}
          className="object-contain w-[161px] shrink-0"
        />
        
        <div className="text-base text-white font-bold tracking-[0.13px] leading-none w-[135px]">
          <h4 className="text-[rgba(204,204,204,1)] mb-8">{t('footer.company')}</h4>
          <nav>
            <ul className="space-y-8">
              {companyLinks.map((link) => (
                <li key={link.labelKey}>
                  <a 
                    href={link.href} 
                    className="hover:text-[#F6C874] transition-colors"
                    aria-label={t(link.labelKey)}
                  >
                    {t(link.labelKey)}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="text-base text-white font-bold tracking-[0.13px] leading-none w-[135px]">
          <h4 className="text-[rgba(204,204,204,1)] mb-8">{t('footer.community')}</h4>
          <nav>
            <ul className="space-y-8">
              {communityLinks.map((link) => (
                <li key={link.labelKey}>
                  {'isRoute' in link && link.isRoute ? (
                    <Link
                      to={link.href}
                      className="hover:text-[#F6C874] transition-colors"
                      aria-label={t(link.labelKey)}
                    >
                      {t(link.labelKey)}
                    </Link>
                  ) : (
                    <a
                      href={link.href}
                      className="hover:text-[#F6C874] transition-colors"
                      aria-label={t(link.labelKey)}
                    >
                      {t(link.labelKey)}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="text-base text-white font-bold tracking-[0.13px] leading-none w-[135px]">
          <h4 className="text-[rgba(204,204,204,1)] mb-8">{t('footer.usefulLinks')}</h4>
          <nav>
            <ul className="space-y-8">
              {usefulLinks.map((link) => (
                <li key={link.labelKey}>
                  <a 
                    href={link.href} 
                    className="hover:text-[#F6C874] transition-colors"
                    aria-label={t(link.labelKey)}
                  >
                    {t(link.labelKey)}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="flex min-w-60 flex-col items-stretch w-[278px]">
          <div className="flex items-center gap-4 mb-3.5">
            <a
              href={FACEBOOK_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="grid size-14 shrink-0 place-items-center rounded-[50px] bg-[#121212] transition-colors hover:bg-[#333] focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#121212]"
              aria-label="AsraPa on Facebook"
            >
              <Facebook className="size-5 text-white" />
            </a>
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="grid size-14 shrink-0 place-items-center rounded-[50px] bg-[#121212] transition-colors hover:bg-[#333] focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#121212]"
              aria-label="AsraPa on Instagram"
            >
              <Instagram className="size-5 text-white" />
            </a>
          </div>
          
          <div className="flex gap-2.5">
            <a
              href="https://apps.apple.com/app/asrapa-music"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Download from App Store"
            >
              <img
                src="https://api.builder.io/api/v1/image/assets/e4fe701087e74a95b6a29ed12c1bd7bc/e31ccb7066e64a27a7cbfa183960fcb5791da114?placeholderIfAbsent=true"
                alt="Download on App Store"
                className="aspect-[3.44] object-contain w-[134px] shrink-0 rounded-md hover:opacity-80 transition-opacity"
              />
            </a>
            <a
              href="https://play.google.com/store/apps/details?id=com.asrapa.music"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Download from Google Play"
            >
              <img
                src="https://api.builder.io/api/v1/image/assets/e4fe701087e74a95b6a29ed12c1bd7bc/963e7ad2396dcc3cf3f719aca69e1dfe2b36f109?placeholderIfAbsent=true"
                alt="Get it on Google Play"
                className="aspect-[3.44] object-contain w-[134px] shrink-0 rounded-md hover:opacity-80 transition-opacity"
              />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
