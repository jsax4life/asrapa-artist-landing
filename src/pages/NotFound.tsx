import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useTranslation } from 'react-i18next';

const NotFound = () => {
  const location = useLocation();
  const { t } = useTranslation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 text-white">{t('notFoundPage.title')}</h1>
        <p className="text-xl text-white/60 mb-4">{t('notFoundPage.message')}</p>
        <a href="/" className="text-[#C40505] hover:underline">
          {t('notFoundPage.backHome')}
        </a>
      </div>
    </div>
  );
};

export default NotFound;
