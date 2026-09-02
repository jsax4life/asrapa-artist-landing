import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useForgotPassword } from '@/hooks/use-forgot-password';
import { ROUTES } from '@/constants/routes';

const ForgotPassword: React.FC = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const { sendResetCode, isSending } = useForgotPassword();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) {
      setError(t('auth.emailRequired'));
      return;
    }
    if (!/\S+@\S+\.\S+/.test(trimmed)) {
      setError(t('auth.emailInvalid'));
      return;
    }
    setError('');
    sendResetCode(trimmed);
  };

  return (
    <main className="min-h-screen px-4 md:pl-16 md:pr-0">
      <div className="flex flex-col items-center justify-center min-h-screen py-8">
        <div className="w-full max-w-md bg-[rgba(210,216,218,0.08)] rounded-xl p-6 shadow-card">
          <header className="text-center mb-6">
            <h1 className="text-white text-3xl font-bold">{t('auth.forgotPasswordTitle')}</h1>
            <p className="text-[#D2D8DA] mt-2">{t('auth.forgotPasswordDesc')}</p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col">
              <label className="text-white font-bold text-sm mb-2">{t('auth.email')}</label>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError('');
                }}
                className={`min-h-12 rounded-lg px-4 py-3 bg-[rgba(210,216,218,0.16)] text-[#D2D8DA] placeholder:text-[#D2D8DA] outline-none border ${error ? 'border-red-500' : 'border-transparent'}`}
                placeholder={t('auth.emailPlaceholder')}
                disabled={isSending}
              />
              {error && <span className="text-xs text-red-500 mt-1">{error}</span>}
            </div>

            <button
              type="submit"
              disabled={isSending}
              className={`w-full min-h-12 rounded-full px-6 py-3 text-white font-semibold transition-colors ${
                isSending ? 'bg-gray-500 cursor-not-allowed' : 'bg-[#C40505] hover:bg-[#E60606]'
              }`}
            >
              {isSending ? t('auth.sendingCode') : t('auth.sendResetCode')}
            </button>

            <div className="text-center text-sm text-[#D2D8DA]">
              <Link to={ROUTES.LOGIN} className="text-[#F6C874] hover:underline">
                {t('auth.backToLogin')}
              </Link>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
};

export default ForgotPassword;
