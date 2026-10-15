import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './features/auth/context/AuthContext';
import { ToastProvider } from './features/common/context/ToastContext';
import ProtectedRoute from './features/auth/components/ProtectedRoute';
import RoleRoute from './features/auth/components/RoleRoute';
import PublicOnlyRoute from './features/auth/components/PublicOnlyRoute';
import PublicLayout from './components/layout/PublicLayout';
import AuthLayout from './components/layout/AuthLayout';
import DashboardLayout from './components/layout/DashboardLayout';
import Spinner from './components/ui/Spinner';
import ROUTES from './config/routes';

// Landing & 404
const LandingPage = lazy(() => import('./pages/LandingPage'));
const NotFoundPage = lazy(() => import('./pages/404NotFound'));

// Auth Pages
const TeamRegisterPage = lazy(() => import('./features/auth/pages/TeamRegisterPage'));
const TeamLoginPage = lazy(() => import('./features/auth/pages/TeamLoginPage'));
const StaffLoginPage = lazy(() => import('./features/auth/pages/StaffLoginPage'));

// Team Pages
const TeamDashboardPage = lazy(() => import('./features/team/pages/TeamDashboardPage'));
const SubmissionPage = lazy(() => import('./features/team/pages/SubmissionPage'));

// Judge Pages
const JudgeSubmissionsPage = lazy(() => import('./features/judge/pages/JudgeSubmissionsPage'));
const JudgeReviewPage = lazy(() => import('./features/judge/pages/JudgeReviewPage'));
const MyReviewsPage = lazy(() => import('./features/judge/pages/MyReviewsPage'));

// Admin Pages
const AdminOverviewPage = lazy(() => import('./features/admin/pages/AdminOverviewPage'));
const TeamsPage = lazy(() => import('./features/admin/pages/TeamsPage'));
const TeamDetailPage = lazy(() => import('./features/admin/pages/TeamDetailPage'));
const SubmissionsPage = lazy(() => import('./features/admin/pages/SubmissionsPage'));
const SubmissionDetailPage = lazy(() => import('./features/admin/pages/SubmissionDetailPage'));
const JudgesPage = lazy(() => import('./features/admin/pages/JudgesPage'));
const AnnouncementsPage = lazy(() => import('./features/admin/pages/AnnouncementsPage'));
const CompetitionSettingsPage = lazy(() => import('./features/admin/pages/CompetitionSettingsPage'));

function AppFallback() {
  return <Spinner fullScreen text="Loading Pixel Patakha..." />;
}

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <Suspense fallback={<AppFallback />}>
            <Routes>
              {/* Public Routes with Navbar, Announcement Strip & Footer */}
              <Route element={<PublicLayout />}>
                <Route path={ROUTES.LANDING} element={<LandingPage />} />
              </Route>

              {/* Public Only Auth Routes */}
              <Route element={<PublicOnlyRoute />}>
                <Route element={<AuthLayout />}>
                  <Route path={ROUTES.REGISTER} element={<TeamRegisterPage />} />
                  <Route path={ROUTES.LOGIN} element={<TeamLoginPage />} />
                  <Route path={ROUTES.STAFF_LOGIN} element={<StaffLoginPage />} />
                </Route>
              </Route>

              {/* Protected Team Routes */}
              <Route element={<RoleRoute allowedRoles={['team']} />}>
                <Route element={<DashboardLayout />}>
                  <Route path={ROUTES.TEAM_DASHBOARD} element={<TeamDashboardPage />} />
                  <Route path={ROUTES.TEAM_SUBMISSION} element={<SubmissionPage />} />
                </Route>
              </Route>

              {/* Protected Judge Routes */}
              <Route element={<RoleRoute allowedRoles={['judge']} />}>
                <Route element={<DashboardLayout />}>
                  <Route path={ROUTES.JUDGE_SUBMISSIONS} element={<JudgeSubmissionsPage />} />
                  <Route path={ROUTES.JUDGE_REVIEW} element={<JudgeReviewPage />} />
                  <Route path={ROUTES.JUDGE_REVIEWS} element={<MyReviewsPage />} />
                </Route>
              </Route>

              {/* Protected Admin Routes */}
              <Route element={<RoleRoute allowedRoles={['admin']} />}>
                <Route element={<DashboardLayout />}>
                  <Route path={ROUTES.ADMIN_OVERVIEW} element={<AdminOverviewPage />} />
                  <Route path={ROUTES.ADMIN_TEAMS} element={<TeamsPage />} />
                  <Route path={ROUTES.ADMIN_TEAM_DETAIL} element={<TeamDetailPage />} />
                  <Route path={ROUTES.ADMIN_SUBMISSIONS} element={<SubmissionsPage />} />
                  <Route path={ROUTES.ADMIN_SUBMISSION_DETAIL} element={<SubmissionDetailPage />} />
                  <Route path={ROUTES.ADMIN_JUDGES} element={<JudgesPage />} />
                  <Route path={ROUTES.ADMIN_ANNOUNCEMENTS} element={<AnnouncementsPage />} />
                  <Route path={ROUTES.ADMIN_COMPETITION} element={<CompetitionSettingsPage />} />
                </Route>
              </Route>

              {/* 404 Route */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}
