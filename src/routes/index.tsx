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
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const Login = lazy(() => import('@/pages/Login'));

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
    path: ROUTES.DASHBOARD,
    element: Dashboard,
  },
  {
    path: ROUTES.LOGIN,
    element: Login,
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
