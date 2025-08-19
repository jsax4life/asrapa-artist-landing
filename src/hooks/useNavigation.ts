import { useNavigate, useLocation } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';

export const useNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const goTo = (path: string, replace = false) => {
    if (replace) {
      navigate(path, { replace: true });
    } else {
      navigate(path);
    }
  };

  const goBack = () => {
    navigate(-1);
  };

  const goHome = () => {
    navigate(ROUTES.HOME);
  };

  const goTo404 = () => {
    navigate(ROUTES.NOT_FOUND);
  };

  const isCurrentPath = (path: string) => {
    return location.pathname === path;
  };

  const isHomePage = () => {
    return location.pathname === ROUTES.HOME;
  };

  return {
    navigate,
    location,
    goTo,
    goBack,
    goHome,
    goTo404,
    isCurrentPath,
    isHomePage,
  };
};
