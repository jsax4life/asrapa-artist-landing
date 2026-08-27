import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import en from './locales/en.json';
import fr from './locales/fr.json';

const updateDocumentLanguage = (lng: string) => {
  document.documentElement.lang = lng.split('-')[0];
};

void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      fr: { translation: fr },
    },
    fallbackLng: 'en',
    supportedLngs: ['en', 'fr'],
    load: 'languageOnly',
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
      bindI18n: 'languageChanged loaded',
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'asrapa_language',
    },
  })
  .then(() => {
    updateDocumentLanguage(i18n.language);
  });

i18n.on('languageChanged', updateDocumentLanguage);

export default i18n;
