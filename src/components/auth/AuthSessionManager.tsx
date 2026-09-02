import { useTokenRefresh } from '@/hooks/use-token-refresh';

const AuthSessionManager = () => {
  useTokenRefresh();
  return null;
};

export default AuthSessionManager;
