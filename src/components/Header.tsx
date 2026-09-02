import React from 'react';
import { Menu } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { ROUTES } from '@/constants/routes';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import logo from '../assets/images/asrapa-logo-white.png';

const Header = () => {
  const { t } = useTranslation();
  const location = useLocation();

  const navigationItems = [
    { labelKey: 'nav.aboutUs', href: ROUTES.ABOUT_US },
    { labelKey: 'nav.prices', href: ROUTES.PRICES },
    { labelKey: 'nav.registration', href: ROUTES.REGISTRATION },
    { labelKey: 'nav.artistGuide', href: ROUTES.ARTIST_GUIDE },
    { labelKey: 'nav.advertising', href: ROUTES.ADVERTISING },
  ];

  const isActiveRoute = (path: string) => location.pathname === path;

  return (
    <header className="relative justify-center items-center bg-black flex w-full flex-col text-white tracking-[0.13px] leading-none px-2.5 py-12 max-md:max-w-full">
      <div className="flex w-[1347px] max-w-full items-center gap-[40px_100px] justify-between flex-wrap">
        <Link to={ROUTES.HOME}>
          <img
            src={logo}
            alt={t('footer.logoAlt', { brand: t('brand') })}
            className="aspect-[4.59] object-contain w-[200px] self-stretch shrink-0 my-auto cursor-pointer hover:opacity-80 transition-opacity"
          />
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="self-stretch hidden lg:flex min-w-60 flex-col items-center justify-center my-auto max-md:max-w-full">
          <div className="flex items-center gap-6 flex-wrap max-md:max-w-full">
            {navigationItems.map((item) => (
              <Link
                key={item.labelKey}
                to={item.href}
                className={`self-stretch flex items-center gap-2.5 my-auto p-2.5 text-xl font-bold transition-colors hover:text-[#F6C874] ${
                  isActiveRoute(item.href)
                    ? 'border-b-2 border-b-[#C40505] border-solid text-white'
                    : ''
                }`}
              >
                <span className="self-stretch my-auto">{t(item.labelKey)}</span>
              </Link>
            ))}
            <div className="ml-2 pl-4 border-l border-white/20">
              <LanguageSwitcher />
            </div>
          </div>
        </nav>

        {/* Mobile Navigation */}
        <div className="lg:hidden flex items-center gap-3">
          <LanguageSwitcher variant="compact" />
          <Sheet>
            <SheetTrigger asChild>
              <button
                className="p-2 text-white hover:text-[#F6C874] transition-colors"
                aria-label="Open navigation menu"
              >
                <Menu size={24} />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] bg-black border-white/10">
              <div className="flex flex-col gap-6 mt-8">
                <nav className="flex flex-col gap-4">
                  {navigationItems.map((item) => (
                    <Link
                      key={item.labelKey}
                      to={item.href}
                      className={`block p-3 text-xl font-bold text-white transition-colors hover:text-[#F6C874] ${
                        isActiveRoute(item.href) ? 'border-l-4 border-[#C40505] bg-white/5' : ''
                      }`}
                    >
                      {t(item.labelKey)}
                    </Link>
                  ))}
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
