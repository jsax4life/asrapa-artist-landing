// Route constants for the application
export const ROUTES = {
  HOME: '/',
  NOT_FOUND: '/404',
  ABOUT_US: '/about-us',
  ARTIST_HOME: '/artist-home',
  PRICES: '/prices',
  REGISTRATION: '/registration',
  FORGOT_PASSWORD: '/mot-de-passe-oublie',
  ARTIST_GUIDE: '/artist-guide',
  ADVERTISING: '/advertising',
  TERMS: '/terms',
  DASHBOARD: '/dashboard',
  LOGIN: '/login',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  ANALYTICS: '/analytics',
  MUSIC_LIBRARY: '/dashboard/music',
  AUDIENCE: '/dashboard/audience',
  UPLOAD: '/dashboard/upload',
  TRENDS: '/dashboard/trends',
  EVENTS: '/dashboard/events',
} as const;

// Type for route paths
export type RoutePath = typeof ROUTES[keyof typeof ROUTES];

// Helper function to generate dynamic routes
export const generateRoute = (baseRoute: string, params: Record<string, string>): string => {
  let route = baseRoute;
  Object.entries(params).forEach(([key, value]) => {
    route = route.replace(`:${key}`, value);
  });
  return route;
};

// Helper function to check if a route is active
export const isActiveRoute = (currentPath: string, routePath: string): boolean => {
  return currentPath === routePath;
};
