import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Mail } from 'lucide-react';
import { ROUTES } from '@/constants/routes';
import { api } from '@/lib/api';

const ForgotPassword: React.FC = () => {
  const { t } = useTranslation();
  const brand = t('brand');
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      setError(t('forgotPassword.invalidEmail'));
      return;
    }
    setError(undefined);
    setIsSubmitting(true);
    try {
      await api.requestPasswordReset(email.trim());
    } catch {
      // On affiche toujours la confirmation, même en cas d'erreur, pour ne pas
      // révéler si un compte existe avec cet e-mail (bonne pratique de sécurité).
    } finally {
      setIsSubmitting(false);
      setSent(true);
    }
  };

  return (
    <main className="min-h-screen px-4 md:pl-16 md:pr-0">
      <div className="flex min-h-screen flex-col items-center justify-center py-8">
        <div className="w-full max-w-md rounded-xl bg-[rgba(210,216,218,0.08)] p-6 shadow-card">
          {sent ? (
            <div className="text-center">
              <span className="mx-auto grid size-14 place-items-center rounded-full bg-[#C40505]/15 text-[#C40505]">
                <Mail className="size-6" />
              </span>
              <h1 className="mt-4 text-2xl font-bold text-white">
                {t('forgotPassword.sentTitle')}
              </h1>
              <p className="mt-2 text-sm text-[#D2D8DA]">
                {t('forgotPassword.sentBody', { email })}
              </p>
              <Link
                to={ROUTES.LOGIN}
                className="mt-6 inline-block text-sm font-semibold text-[#F6C874] hover:underline"
              >
                {t('forgotPassword.backToLogin')}
              </Link>
            </div>
          ) : (
            <>
              <header className="mb-6 text-center">
                <h1 className="text-3xl font-bold text-white">
                  {t('forgotPassword.title')} <span className="text-[#C40505]">{brand}</span>
                </h1>
                <p className="mt-2 text-[#D2D8DA]">{t('forgotPassword.subtitle')}</p>
              </header>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex flex-col">
                  <label className="mb-2 text-sm font-bold text-white">
                    {t('signup.form.email')}
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (error) setError(undefined);
                    }}
                    placeholder={t('signup.form.emailPlaceholder')}
                    className={`min-h-12 rounded-lg border bg-[rgba(210,216,218,0.16)] px-4 py-3 text-[#D2D8DA] outline-none placeholder:text-[#D2D8DA] ${
                      error ? 'border-red-500' : 'border-transparent'
                    }`}
                    disabled={isSubmitting}
                  />
                  {error && <span className="mt-1 text-xs text-red-500">{error}</span>}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`min-h-12 w-full rounded-full px-6 py-3 font-semibold text-white transition-colors ${
                    isSubmitting ? 'cursor-not-allowed bg-gray-500' : 'bg-[#C40505] hover:bg-[#E60606]'
                  }`}
                >
                  {isSubmitting ? t('forgotPassword.sending') : t('forgotPassword.submit')}
                </button>

                <div className="text-center text-sm text-[#D2D8DA]">
                  <Link to={ROUTES.LOGIN} className="text-[#F6C874] hover:underline">
                    {t('forgotPassword.backToLogin')}
                  </Link>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </main>
  );
};

export default ForgotPassword;
