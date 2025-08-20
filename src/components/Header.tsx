import React, { useState } from 'react';
import { Menu } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { ROUTES } from '@/constants/routes';
import logo from '../assets/images/asrapa-logo-white.png';

const Header = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const location = useLocation();

  const navigationItems = [
    { label: 'About Us', href: ROUTES.ABOUT_US },
    // { label: 'Artist Home', href: ROUTES.ARTIST_HOME },
    { label: 'Prices', href: ROUTES.PRICES },
    { label: 'Registration', href: ROUTES.REGISTRATION },
    { label: 'Artist Guide', href: ROUTES.ARTIST_GUIDE },
  ];

  const isActiveRoute = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="relative justify-center items-center bg-black flex w-full flex-col text-white tracking-[0.13px] leading-none px-2.5 py-12 max-md:max-w-full">
      <div className="flex w-[1347px] max-w-full items-center gap-[40px_100px] justify-between flex-wrap">
        <Link to={ROUTES.HOME}>
          <img
            src={logo}
            alt="AsraMusic Logo"
            className="aspect-[4.59] object-contain w-[200px] self-stretch shrink-0 my-auto cursor-pointer hover:opacity-80 transition-opacity"
          />
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="self-stretch hidden lg:flex min-w-60 flex-col items-center justify-center my-auto max-md:max-w-full">
          <div className="flex items-center gap-6 flex-wrap max-md:max-w-full">
            <div className="self-stretch flex items-center whitespace-nowrap my-auto">
              <button
                className="self-stretch my-auto text-xl font-bold"
                onClick={() => setSelectedLanguage(selectedLanguage === 'English' ? 'Spanish' : 'English')}
                aria-label="Select language"
              >
                {selectedLanguage}
              </button>
              <img
                src="https://api.builder.io/api/v1/image/assets/e4fe701087e74a95b6a29ed12c1bd7bc/e56dc8cadcad8a341628d7065a76af4cd254ccf3?placeholderIfAbsent=true"
                alt="Language selector arrow"
                className="aspect-[1] object-contain w-6 self-stretch shrink-0 my-auto"
              />
            </div>
            {navigationItems.map((item) => (
              <Link
                key={item.label}
                to={item.href}
                className={`self-stretch flex items-center gap-2.5 my-auto p-2.5 text-xl font-bold transition-colors hover:text-[#F6C874] ${
                  isActiveRoute(item.href) ? 'border-b-2 border-b-white border-solid' : ''
                }`}
              >
                <span className="self-stretch my-auto">{item.label}</span>
              </Link>
            ))}
          </div>
        </nav>

        {/* Mobile Navigation */}
        <div className="lg:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <button
                className="p-2 text-white hover:text-[#F6C874] transition-colors"
                aria-label="Open navigation menu"
              >
                <Menu size={24} />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] bg-black border-gray-800">
              <div className="flex flex-col gap-6 mt-8">
                {/* Language Selector */}
                <div className="flex items-center justify-center gap-2 pb-4 border-b border-gray-800">
                  <button
                    className="text-xl font-bold text-white"
                    onClick={() => setSelectedLanguage(selectedLanguage === 'English' ? 'Spanish' : 'English')}
                    aria-label="Select language"
                  >
                    {selectedLanguage}
                  </button>
                  <img
                    src="https://api.builder.io/api/v1/image/assets/e4fe701087e74a95b6a29ed12c1bd7bc/e56dc8cadcad8a341628d7065a76af4cd254ccf3?placeholderIfAbsent=true"
                    alt="Language selector arrow"
                    className="aspect-[1] object-contain w-6"
                  />
                </div>
                
                {/* Navigation Items */}
                <nav className="flex flex-col gap-4">
                  {navigationItems.map((item) => (
                    <Link
                      key={item.label}
                      to={item.href}
                      className={`block p-3 text-xl font-bold text-white transition-colors hover:text-[#F6C874] ${
                        isActiveRoute(item.href) ? 'border-l-4 border-white bg-gray-900' : ''
                      }`}
                    >
                      {item.label}
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
