import { createBrowserRouter, Navigate } from 'react-router-dom';
import { Suspense } from 'react';
import Layout from '../components/Layout';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { ROUTES } from '@/constants/routes';
import RequireAuth from '@/components/RequireAuth';
import { lazyWithRetry } from '@/lib/lazyWithRetry';
import { ErrorFallback } from '@/components/ErrorBoundary';

// Lazy load pages (retry once on stale chunk after deploy)
const Index = lazyWithRetry(() => import('@/pages/Index'));
const NotFound = lazyWithRetry(() => import('@/pages/NotFound'));
const AboutUs = lazyWithRetry(() => import('@/pages/AboutUs'));
const ArtistHome = lazyWithRetry(() => import('@/pages/ArtistHome'));
const Prices = lazyWithRetry(() => import('@/pages/Prices'));
const Registration = lazyWithRetry(() => import('@/pages/Registration'));
const ArtistGuide = lazyWithRetry(() => import('@/pages/ArtistGuide'));
const Advertising = lazyWithRetry(() => import('@/pages/Advertising'));
const Terms = lazyWithRetry(() => import('@/pages/Terms'));
const Dashboard = lazyWithRetry(() => import('@/pages/Dashboard'));
const Login = lazyWithRetry(() => import('@/pages/Login'));
const ForgotPassword = lazyWithRetry(() => import('@/pages/ForgotPassword'));
const ResetPassword = lazyWithRetry(() => import('@/pages/ResetPassword'));
const Analytics = lazyWithRetry(() => import('@/pages/Analytics'));
const MusicLibrary = lazyWithRetry(() => import('@/pages/MusicLibrary'));
const Audience = lazyWithRetry(() => import('@/pages/Audience'));
const Upload = lazyWithRetry(() => import('@/pages/Upload'));
const Trends = lazyWithRetry(() => import('@/pages/Trends'));
const Events = lazyWithRetry(() => import('@/pages/Events'));
const Settings = lazyWithRetry(() => import('@/pages/Settings'));
const SongLyrics = lazyWithRetry(() => import('@/pages/SongLyrics'));

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
    path: ROUTES.FORGOT_PASSWORD,
    element: ForgotPassword,
  },
  {
    path: ROUTES.RESET_PASSWORD,
    element: ResetPassword,
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
    path: ROUTES.SETTINGS,
    element: Settings,
  },
  {
    path: ROUTES.SONG_LYRICS,
    element: SongLyrics,
  },
  {
    path: ROUTES.NOT_FOUND,
    element: NotFound,
  },
];

// Create the router with error boundary and loading states
export const router = createBrowserRouter([
  {
    errorElement: <ErrorFallback />,
    children: [
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
    path: ROUTES.FORGOT_PASSWORD,
    element: (
      <Layout>
        <Suspense fallback={<LoadingSpinner />}>
          <ForgotPassword />
        </Suspense>
      </Layout>
    ),
  },
  {
    path: ROUTES.RESET_PASSWORD,
    element: (
      <Layout>
        <Suspense fallback={<LoadingSpinner />}>
          <ResetPassword />
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
    path: ROUTES.TERMS,
    element: (
      <Layout>
        <Suspense fallback={<LoadingSpinner />}>
          <Terms />
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
    path: ROUTES.SETTINGS,
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <RequireAuth>
          <Settings />
        </RequireAuth>
      </Suspense>
    ),
  },
  {
    path: ROUTES.SONG_LYRICS,
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <RequireAuth>
          <SongLyrics />
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
    ],
  },
]);

export default routes;
