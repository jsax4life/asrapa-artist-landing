import React, { useState } from 'react';
import { Link, useLocation, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { useResetPassword } from '@/hooks/use-reset-password';
import { ROUTES } from '@/constants/routes';

const ResetPassword: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const email = (location.state as { email?: string })?.email ?? '';
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ otp?: string; password?: string; passwordConfirm?: string }>({});
  const { resetPassword, isResetting } = useResetPassword();

  if (!email) {
    return <Navigate to={ROUTES.FORGOT_PASSWORD} replace />;
  }

  const validate = () => {
    const nextErrors: { otp?: string; password?: string; passwordConfirm?: string } = {};
    if (otp.length !== 6) nextErrors.otp = t('auth.otpRequired');
    if (password.length < 8) nextErrors.password = t('auth.passwordMinLength');
    if (password !== passwordConfirm) nextErrors.passwordConfirm = t('auth.passwordsMustMatch');
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    resetPassword({ otp, password, passwordConfirm });
  };

  return (
    <main className="min-h-screen px-4 md:pl-16 md:pr-0">
      <div className="flex flex-col items-center justify-center min-h-screen py-8">
        <div className="w-full max-w-md bg-[rgba(210,216,218,0.08)] rounded-xl p-6 shadow-card">
          <header className="text-center mb-6">
            <h1 className="text-white text-3xl font-bold">{t('auth.resetPasswordTitle')}</h1>
            <p className="text-[#D2D8DA] mt-2">
              {t('auth.resetPasswordDesc', { email })}
            </p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="flex flex-col items-center gap-2">
              <label className="text-white font-bold text-sm">{t('auth.enterOtp')}</label>
              <InputOTP maxLength={6} value={otp} onChange={setOtp} disabled={isResetting}>
                <InputOTPGroup>
                  {Array.from({ length: 6 }).map((_, index) => (
                    <InputOTPSlot
                      key={index}
                      index={index}
                      className="bg-[rgba(210,216,218,0.16)] text-white border-white/20"
                    />
                  ))}
                </InputOTPGroup>
              </InputOTP>
              {errors.otp && <span className="text-xs text-red-500">{errors.otp}</span>}
            </div>

            <div className="flex flex-col">
              <label className="text-white font-bold text-sm mb-2">{t('auth.newPassword')}</label>
              <div className="flex items-center min-h-12 rounded-lg px-4 py-3 bg-[rgba(210,216,218,0.16)] border border-transparent">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
                  }}
                  className="flex-1 bg-transparent text-[#D2D8DA] outline-none"
                  placeholder={t('auth.newPasswordPlaceholder')}
                  disabled={isResetting}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className="text-[#D2D8DA] text-sm"
                >
                  {showPassword ? t('auth.hide') : t('auth.show')}
                </button>
              </div>
              {errors.password && <span className="text-xs text-red-500 mt-1">{errors.password}</span>}
            </div>

            <div className="flex flex-col">
              <label className="text-white font-bold text-sm mb-2">{t('auth.confirmNewPassword')}</label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={passwordConfirm}
                onChange={(e) => {
                  setPasswordConfirm(e.target.value);
                  if (errors.passwordConfirm) {
                    setErrors((prev) => ({ ...prev, passwordConfirm: undefined }));
                  }
                }}
                className="min-h-12 rounded-lg px-4 py-3 bg-[rgba(210,216,218,0.16)] text-[#D2D8DA] outline-none border border-transparent"
                placeholder={t('auth.confirmNewPasswordPlaceholder')}
                disabled={isResetting}
              />
              {errors.passwordConfirm && (
                <span className="text-xs text-red-500 mt-1">{errors.passwordConfirm}</span>
              )}
            </div>

            <button
              type="submit"
              disabled={isResetting}
              className={`w-full min-h-12 rounded-full px-6 py-3 text-white font-semibold transition-colors ${
                isResetting ? 'bg-gray-500 cursor-not-allowed' : 'bg-[#C40505] hover:bg-[#E60606]'
              }`}
            >
              {isResetting ? t('auth.resettingPassword') : t('auth.resetPasswordButton')}
            </button>

            <div className="text-center text-sm text-[#D2D8DA]">
              <Link to={ROUTES.FORGOT_PASSWORD} className="text-[#F6C874] hover:underline">
                {t('auth.resendCode')}
              </Link>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
};

export default ResetPassword;
