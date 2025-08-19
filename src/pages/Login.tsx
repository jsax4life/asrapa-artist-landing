import React, { useState } from 'react';
import { useArtistLogin } from '@/hooks/use-artist-login';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';

const Login: React.FC = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ identifier?: string; password?: string }>({});
  const { login, isLoggingIn } = useArtistLogin();
  const { toast } = useToast();

  const validate = () => {
    const nextErrors: { identifier?: string; password?: string } = {};
    if (!identifier.trim()) {
      nextErrors.identifier = 'Email or Stage name is required';
    }
    if (!password) {
      nextErrors.password = 'Password is required';
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  console.log(identifier.trim(), password)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    login({ emailOrStageName: identifier.trim(), password });
  };

  return (
    <main className=" min-h-screen px-4 md:pl-16 md:pr-0">
      <div className="flex flex-col items-center justify-center min-h-screen py-8">
        <div className="w-full max-w-md bg-[rgba(210,216,218,0.08)] rounded-xl p-6 shadow-card">
          <header className="text-center mb-6">
            <h1 className="text-white text-3xl font-bold">
              Welcome to <span className="text-[#C40505]">AsraMusic</span>
            </h1>
            <p className="text-[#D2D8DA] mt-2">Log in to your artist dashboard</p>
          </header>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col">
              <label className="text-white font-bold text-sm mb-2">Email or Stage name</label>
              <input
                type="text"
                value={identifier}
                onChange={(e) => {
                  setIdentifier(e.target.value);
                  if (errors.identifier) setErrors((p) => ({ ...p, identifier: undefined }));
                }}
                className={`min-h-12 rounded-lg px-4 py-3 bg-[rgba(210,216,218,0.16)] text-[#D2D8DA] placeholder:text-[#D2D8DA] outline-none border ${errors.identifier ? 'border-red-500' : 'border-transparent'}`}
                placeholder="Enter your email or stage name"
                aria-label="Email or Stage name"
                disabled={isLoggingIn}
              />
              {errors.identifier && <span className="text-xs text-red-500 mt-1">{errors.identifier}</span>}
            </div>

            <div className="flex flex-col">
              <label className="text-white font-bold text-sm mb-2">Password</label>
              <div className={`flex items-center min-h-12 rounded-lg px-4 py-3 bg-[rgba(210,216,218,0.16)] border ${errors.password ? 'border-red-500' : 'border-transparent'}`}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors((p) => ({ ...p, password: undefined }));
                  }}
                  className="flex-1 bg-transparent text-[#D2D8DA] placeholder:text-[#D2D8DA] outline-none"
                  placeholder="Enter your password"
                  aria-label="Password"
                  disabled={isLoggingIn}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="text-[#D2D8DA] text-sm"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              {errors.password && <span className="text-xs text-red-500 mt-1">{errors.password}</span>}
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className={`w-full min-h-12 rounded-full px-6 py-3 text-white font-semibold transition-colors ${
                isLoggingIn ? 'bg-gray-500 cursor-not-allowed' : 'bg-[#C40505] hover:bg-[#E60606]'
              }`}
            >
              {isLoggingIn ? 'Signing in...' : 'Sign In'}
            </button>

            <div className="text-center text-sm text-[#D2D8DA]">
              Don’t have an account?{' '}
              <Link to={ROUTES.REGISTRATION} className="text-[#F6C874] hover:underline">
                Create one
              </Link>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
};

export default Login;
