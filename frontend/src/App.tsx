import React, { useEffect } from 'react';
import {
  createRootRoute,
  createRoute,
  createRouter,
  RouterProvider,
  Outlet,
  Navigate,
} from '@tanstack/react-router';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { getActiveSiteEvent } from './lib/store';

// Pages
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import HomePage from './pages/HomePage';
import ShortsPage from './pages/ShortsPage';
import UploadPage from './pages/UploadPage';
import UploadLongVideoPage from './pages/UploadLongVideoPage';
import LongVideoMetadataPage from './pages/LongVideoMetadataPage';
import UploadShortsPage from './pages/UploadShortsPage';
import NotificationsPage from './pages/NotificationsPage';
import ProfilePage from './pages/ProfilePage';
import AnalyticsPage from './pages/AnalyticsPage';
import MonetizationPage from './pages/MonetizationPage';
import AboutMonetizationPage from './pages/AboutMonetizationPage';
import VideoDetailPage from './pages/VideoDetailPage';
import SearchResultsPage from './pages/SearchResultsPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminMonetizationRequestsPage from './pages/AdminMonetizationRequestsPage';
import AdminPayoutRequestsPage from './pages/AdminPayoutRequestsPage';
import AdminNotificationSenderPage from './pages/AdminNotificationSenderPage';
import AdminUserStatsEditorPage from './pages/AdminUserStatsEditorPage';
import AdminEventControlPage from './pages/AdminEventControlPage';
import AdminStrikesPanelPage from './pages/AdminStrikesPanelPage';
import AdminCreatorManagementPage from './pages/AdminCreatorManagementPage';
import AdminEmbedVideoPage from './pages/AdminEmbedVideoPage';
import AuthenticatedLayout from './components/AuthenticatedLayout';

// ── Auth Guard Components ────────────────────────────────────────────────────

function RequireAuthLayout() {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  return (
    <AuthenticatedLayout>
      <Outlet />
    </AuthenticatedLayout>
  );
}

function RequireAdminLayout() {
  const { isAdmin, isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" />;
  if (!isAdmin) return <Navigate to="/home" />;
  return (
    <AuthenticatedLayout>
      <Outlet />
    </AuthenticatedLayout>
  );
}

function RedirectIfAuthIndex() {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) return <Navigate to="/home" />;
  return <Navigate to="/login" />;
}

function LoginPageGuarded() {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) return <Navigate to="/home" />;
  return <LoginPage />;
}

function SignupPageGuarded() {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) return <Navigate to="/home" />;
  return <SignupPage />;
}

function AppThemeSync() {
  const { siteEvent } = useAuth();
  useEffect(() => {
    const event = getActiveSiteEvent();
    if (event?.active && event.theme) {
      document.body.className = `theme-${event.theme}`;
    } else {
      document.body.className = '';
    }
  }, [siteEvent]);
  return null;
}

function RootComponent() {
  return (
    <>
      <AppThemeSync />
      <Outlet />
      <Toaster theme="dark" position="top-center" richColors />
    </>
  );
}

// ── Route Tree ───────────────────────────────────────────────────────────────

const rootRoute = createRootRoute({
  component: RootComponent,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: RedirectIfAuthIndex,
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: LoginPageGuarded,
});

const signupRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/signup',
  component: SignupPageGuarded,
});

// Authenticated layout route
const authLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'auth-layout',
  component: RequireAuthLayout,
});

const homeRoute = createRoute({
  getParentRoute: () => authLayoutRoute,
  path: '/home',
  component: HomePage,
});

const shortsRoute = createRoute({
  getParentRoute: () => authLayoutRoute,
  path: '/shorts',
  component: ShortsPage,
});

const uploadRoute = createRoute({
  getParentRoute: () => authLayoutRoute,
  path: '/upload',
  component: UploadPage,
});

const uploadLongVideoRoute = createRoute({
  getParentRoute: () => authLayoutRoute,
  path: '/upload/long-video',
  component: UploadLongVideoPage,
});

const longVideoMetadataRoute = createRoute({
  getParentRoute: () => authLayoutRoute,
  path: '/upload/long-video/metadata',
  component: LongVideoMetadataPage,
});

const uploadShortsRoute = createRoute({
  getParentRoute: () => authLayoutRoute,
  path: '/upload/shorts',
  component: UploadShortsPage,
});

const notificationsRoute = createRoute({
  getParentRoute: () => authLayoutRoute,
  path: '/notifications',
  component: NotificationsPage,
});

const profileRoute = createRoute({
  getParentRoute: () => authLayoutRoute,
  path: '/profile',
  component: ProfilePage,
});

const profileUserRoute = createRoute({
  getParentRoute: () => authLayoutRoute,
  path: '/profile/$username',
  component: ProfilePage,
});

const analyticsRoute = createRoute({
  getParentRoute: () => authLayoutRoute,
  path: '/analytics',
  component: AnalyticsPage,
});

const monetizationRoute = createRoute({
  getParentRoute: () => authLayoutRoute,
  path: '/monetization',
  component: MonetizationPage,
});

const aboutMonetizationRoute = createRoute({
  getParentRoute: () => authLayoutRoute,
  path: '/about-monetization',
  component: AboutMonetizationPage,
});

const videoDetailRoute = createRoute({
  getParentRoute: () => authLayoutRoute,
  path: '/video/$videoId',
  component: VideoDetailPage,
});

const searchRoute = createRoute({
  getParentRoute: () => authLayoutRoute,
  path: '/search',
  component: SearchResultsPage,
});

// Admin layout route
const adminLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'admin-layout',
  component: RequireAdminLayout,
});

const adminDashboardRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: '/admin',
  component: AdminDashboardPage,
});

const adminMonetizationRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: '/admin/monetization-requests',
  component: AdminMonetizationRequestsPage,
});

const adminPayoutRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: '/admin/payout-requests',
  component: AdminPayoutRequestsPage,
});

const adminNotificationRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: '/admin/send-notification',
  component: AdminNotificationSenderPage,
});

const adminStatsRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: '/admin/edit-stats',
  component: AdminUserStatsEditorPage,
});

const adminEventsRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: '/admin/events',
  component: AdminEventControlPage,
});

const adminStrikesRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: '/admin/strikes',
  component: AdminStrikesPanelPage,
});

const adminCreatorRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: '/admin/creator-management',
  component: AdminCreatorManagementPage,
});

const adminEmbedRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: '/admin/embed-video',
  component: AdminEmbedVideoPage,
});

// ── Router ───────────────────────────────────────────────────────────────────

const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  signupRoute,
  authLayoutRoute.addChildren([
    homeRoute,
    shortsRoute,
    uploadRoute,
    uploadLongVideoRoute,
    longVideoMetadataRoute,
    uploadShortsRoute,
    notificationsRoute,
    profileRoute,
    profileUserRoute,
    analyticsRoute,
    monetizationRoute,
    aboutMonetizationRoute,
    videoDetailRoute,
    searchRoute,
  ]),
  adminLayoutRoute.addChildren([
    adminDashboardRoute,
    adminMonetizationRoute,
    adminPayoutRoute,
    adminNotificationRoute,
    adminStatsRoute,
    adminEventsRoute,
    adminStrikesRoute,
    adminCreatorRoute,
    adminEmbedRoute,
  ]),
]);

const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

// ── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}
