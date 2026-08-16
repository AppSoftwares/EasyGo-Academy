import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Capacitor } from '@capacitor/core';

// Pages
import { LandingPage } from "./pages/LandingPage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { ForgotPasswordPage } from "./pages/ForgotPasswordPage";
import { DashboardPage } from "./pages/DashboardPage";
import StudentUniverse from "./pages/student/StudentUniverse";
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { TeacherDashboard } from "./pages/teacher/TeacherDashboard";
import { PublicLevelTest } from "./pages/PublicLevelTest";

// Profile Sub-pages
import { AppearancePage } from "./pages/profile/AppearancePage";
import { AccountPage } from "./pages/profile/AccountPage";
import { PrivacyPage } from "./pages/profile/PrivacyPage";
import { NotificationsPage } from "./pages/profile/NotificationsPage";
import { HelpCenterPage } from "./pages/profile/HelpCenterPage";
import { LegalPage } from "./pages/profile/LegalPage";

// Stores
import { useAuthStore } from "./store/useAuthStore";

// Type definition for route props
interface ProtectedRouteProps {
  children: React.ReactNode;
}

// Protected Route Component
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated } = useAuthStore() as any;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// Public Route Component
const PublicRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, needsLevelTest } = useAuthStore() as any;

  if (
    isAuthenticated &&
    !needsLevelTest &&
    window.location.pathname !== "/login"
  ) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

function App() {
  const isNative = Capacitor.isNativePlatform();

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route
          path="/"
          element={
            <PublicRoute>
              <LandingPage />
            </PublicRoute>
          }
        />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/level-test" element={<PublicLevelTest />} />

        {/* Protected Dashboard / Student Universe */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <StudentUniverse />
            </ProtectedRoute>
          }
        />

        {/* Profile Routes */}
        <Route path="/profile/account" element={<ProtectedRoute><AccountPage /></ProtectedRoute>} />
        <Route path="/profile/privacy" element={<ProtectedRoute><PrivacyPage /></ProtectedRoute>} />
        <Route path="/profile/appearance" element={<ProtectedRoute><AppearancePage /></ProtectedRoute>} />
        <Route path="/profile/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />
        <Route path="/profile/help" element={<ProtectedRoute><HelpCenterPage /></ProtectedRoute>} />
        <Route path="/profile/legal" element={<ProtectedRoute><LegalPage /></ProtectedRoute>} />

        {/* Admin Routes */}
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Teacher Routes */}
        <Route
          path="/teacher/*"
          element={
            <ProtectedRoute>
              <TeacherDashboard />
            </ProtectedRoute>
          }
        />

        {/* Legacy Dashboard (if needed) */}
        <Route
          path="/legacy-dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />

        {/* Default Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
