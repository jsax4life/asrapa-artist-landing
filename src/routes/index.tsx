import { createBrowserRouter, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import Layout from '../components/Layout';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { ROUTES } from '@/constants/routes';
import RequireAuth from '@/components/RequireAuth';

// Lazy load pages for better performance
const Index = lazy(() => import('@/pages/Index'));
const NotFound = lazy(() => import('@/pages/NotFound'));
const AboutUs = lazy(() => import('@/pages/AboutUs'));
const ArtistHome = lazy(() => import('@/pages/ArtistHome'));
const Prices = lazy(() => import('@/pages/Prices'));
const Registration = lazy(() => import('@/pages/Registration'));
const ArtistGuide = lazy(() => import('@/pages/ArtistGuide'));
const Advertising = lazy(() => import('@/pages/Advertising'));
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const Login = lazy(() => import('@/pages/Login'));
const Analytics = lazy(() => import('@/pages/Analytics')); // Added Analytics page
const MusicLibrary = lazy(() => import('@/pages/MusicLibrary')); // Added MusicLibrary page
const Audience = lazy(() => import('@/pages/Audience')); // Added Audience page
const Upload = lazy(() => import('@/pages/Upload')); // Added Upload page
const Trends = lazy(() => import('@/pages/Trends')); // Added Trends page
const Events = lazy(() => import('@/pages/Events')); // Added Events page

// Route configuration with proper typing
export interface RouteConfig {
  path: string;
  element: React.ComponentType;
  children?: RouteConfig[];
  index?: boolean;
}

// Define routes
const routes: RouteConfig[] = [
  {
    path: ROUTES.HOME,
    element: Index,
  },
  {
    path: ROUTES.ABOUT_US,
    element: AboutUs,
  },
  {
    path: ROUTES.ARTIST_HOME,
    element: ArtistHome,
  },
  {
    path: ROUTES.PRICES,
    element: Prices,
  },
  {
    path: ROUTES.REGISTRATION,
    element: Registration,
  },
  {
    path: ROUTES.ARTIST_GUIDE,
    element: ArtistGuide,
  },
  {
    path: ROUTES.ADVERTISING,
    element: Advertising,
  },
  {
    path: ROUTES.DASHBOARD,
    element: Dashboard,
  },
  {
    path: ROUTES.LOGIN,
    element: Login,
  },
  {
    path: ROUTES.ANALYTICS, // Added Analytics route
    element: Analytics,
  },
  {
    path: ROUTES.MUSIC_LIBRARY, // Added Music Library route
    element: MusicLibrary,
  },
  {
    path: ROUTES.AUDIENCE, // Added Audience route
    element: Audience,
  },
  {
    path: ROUTES.UPLOAD, // Added Upload route
    element: Upload,
  },
  {
    path: ROUTES.TRENDS, // Added Trends route
    element: Trends,
  },
  {
    path: ROUTES.EVENTS, // Added Events route
    element: Events,
  },
  {
    path: ROUTES.NOT_FOUND,
    element: NotFound,
  },
];

// Create the router with error boundary and loading states
export const router = createBrowserRouter([
  {
    path: ROUTES.HOME,
    element: (
      <Layout>
        <Suspense fallback={<LoadingSpinner />}>
          <Index />
        </Suspense>
      </Layout>
    ),
  },
  {
    path: ROUTES.ABOUT_US,
    element: (
      <Layout>
        <Suspense fallback={<LoadingSpinner />}>
          <AboutUs />
        </Suspense>
      </Layout>
    ),
  },
  {
    path: ROUTES.ARTIST_HOME,
    element: (
      <Layout>
        <Suspense fallback={<LoadingSpinner />}>
          <ArtistHome />
        </Suspense>
      </Layout>
    ),
  },
  {
    path: ROUTES.PRICES,
    element: (
      <Layout>
        <Suspense fallback={<LoadingSpinner />}>
          <Prices />
        </Suspense>
      </Layout>
    ),
  },
  {
    path: ROUTES.REGISTRATION,
    element: (
      <Layout>
        <Suspense fallback={<LoadingSpinner />}>
          <Registration />
        </Suspense>
      </Layout>
    ),
  },
  {
    path: ROUTES.LOGIN,
    element: (
      <Layout>
        <Suspense fallback={<LoadingSpinner />}>
          <Login />
        </Suspense>
      </Layout>
    ),
  },
  {
    path: ROUTES.ARTIST_GUIDE,
    element: (
      <Layout>
        <Suspense fallback={<LoadingSpinner />}>
          <ArtistGuide />
        </Suspense>
      </Layout>
    ),
  },
  {
    path: ROUTES.ADVERTISING,
    element: (
      <Layout>
        <Suspense fallback={<LoadingSpinner />}>
          <Advertising />
        </Suspense>
      </Layout>
    ),
  },
  {
    path: ROUTES.DASHBOARD,
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <RequireAuth>
          <Dashboard />
        </RequireAuth>
      </Suspense>
    ),
  },
  {
    path: ROUTES.ANALYTICS, // Added Analytics route with RequireAuth
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <RequireAuth>
          <Analytics />
        </RequireAuth>
      </Suspense>
    ),
  },
  {
    path: ROUTES.MUSIC_LIBRARY, // Added Music Library route with RequireAuth
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <RequireAuth>
          <MusicLibrary />
        </RequireAuth>
      </Suspense>
    ),
  },
  {
    path: ROUTES.AUDIENCE, // Added Audience route with RequireAuth
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <RequireAuth>
          <Audience />
        </RequireAuth>
      </Suspense>
    ),
  },
  {
    path: ROUTES.UPLOAD, // Added Upload route with RequireAuth
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <RequireAuth>
          <Upload />
        </RequireAuth>
      </Suspense>
    ),
  },
  {
    path: ROUTES.TRENDS, // Added Trends route with RequireAuth
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <RequireAuth>
          <Trends />
        </RequireAuth>
      </Suspense>
    ),
  },
  {
    path: ROUTES.EVENTS, // Added Events route with RequireAuth
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <RequireAuth>
          <Events />
        </RequireAuth>
      </Suspense>
    ),
  },
  {
    path: ROUTES.NOT_FOUND,
    element: (
      <Layout>
        <Suspense fallback={<LoadingSpinner />}>
          <NotFound />
        </Suspense>
      </Layout>
    ),
  },
  {
    path: '*',
    element: <Navigate to={ROUTES.NOT_FOUND} replace />,
  },
]);

export default routes;
