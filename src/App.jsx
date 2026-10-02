import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { RoadmapProvider } from './context/RoadmapContext';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { LoadingSpinner } from './components/common/LoadingState';

// Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { OnboardingPage } from './pages/OnboardingPage';
import { DashboardPage } from './pages/DashboardPage';
import { RoadmapPage } from './pages/RoadmapPage';
import { MissionsPage } from './pages/MissionsPage';
import { MissionDetailsPage } from './pages/MissionDetailsPage';
import { AssessmentsPage } from './pages/AssessmentsPage';
import { QuizPage } from './pages/QuizPage';
import { SkillsPage } from './pages/SkillsPage';
import { CoachPage } from './pages/CoachPage';
import { ProfilePage } from './pages/ProfilePage';

// Protected Route Wrapper
const ProtectedRoute = ({ children, requireOnboarding = true }) => {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <LoadingSpinner text="Authenticating..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requireOnboarding && !user?.onboardingComplete) {
    return <Navigate to="/onboarding" replace />;
  }

  return children;
};

// Public Route (redirects to dashboard if already logged in)
const PublicRoute = ({ children }) => {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <LoadingSpinner text="Loading..." />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to={user?.onboardingComplete ? '/dashboard' : '/onboarding'} replace />;
  }

  return children;
};

function AppRoutes() {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<LandingPage />} />
      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <RegisterPage />
          </PublicRoute>
        }
      />

      {/* Onboarding */}
      <Route
        path="/onboarding"
        element={
          <ProtectedRoute requireOnboarding={false}>
            <OnboardingPage />
          </ProtectedRoute>
        }
      />

      {/* Authenticated Workspace App */}
      <Route
        element={
          <ProtectedRoute requireOnboarding={true}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/roadmap" element={<RoadmapPage />} />
        <Route path="/missions" element={<MissionsPage />} />
        <Route path="/missions/:id" element={<MissionDetailsPage />} />
        <Route path="/skills" element={<SkillsPage />} />
        <Route path="/assessments" element={<AssessmentsPage />} />
        <Route path="/assessments/:id" element={<QuizPage />} />
        <Route path="/coach" element={<CoachPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <RoadmapProvider>
          <AppRoutes />
        </RoadmapProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
