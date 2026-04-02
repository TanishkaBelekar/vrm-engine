// src/app/router.tsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import AppShell from "../widgets/app-shell/AppShell";

// Pages
import Dashboard from "../pages/dashboard/Dashboard";
import Vendors from "../pages/vendors/Vendors";
import VendorProfile from "../pages/vendors/VendorProfile";
import Assessments from "../pages/assessments/Assessments";
import AssessmentDetailPage from "../pages/assessments/AssessmentDetailPage";
import EvidencePage from "../pages/evidence/EvidencePage";
import Remediations from "../pages/remediations/Remediations";
import Settings from "../pages/settings/Settings";
import NotificationsPage from "../pages/notifications/NotificationsPage";

// Auth
import LoginPage from "../features/auth-login/LoginPage";
import ProtectedRoute from "../shared/lib/ProtectedRoute";
import { isAuthenticated } from "../shared/lib/auth";

function Router() {
  return (
    <BrowserRouter>
      <Routes>
        {/* PUBLIC ROUTE */}
        <Route
          path="/login"
          element={isAuthenticated() ? <Navigate to="/dashboard" replace /> : <LoginPage />}
        />

        {/* PROTECTED ROUTES */}
        <Route
          element={
            <ProtectedRoute>
              <AppShell />
            </ProtectedRoute>
          }
        >
          {/* Root redirect */}
          <Route
            path="/"
            element={isAuthenticated() ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />}
          />

          {/* DASHBOARD */}
          <Route path="/dashboard" element={<Dashboard />} />

          {/* VENDORS */}
          <Route path="/vendors" element={<Vendors />} />
          <Route path="/vendors/:vendorId" element={<VendorProfile />} />

          {/* ASSESSMENTS */}
          <Route path="/assessments" element={<Assessments />} />
          <Route path="/assessments/:id" element={<AssessmentDetailPage />} />

          {/* EVIDENCE */}
          <Route path="/evidence" element={<EvidencePage />} />

          {/* NOTIFICATIONS */}
          <Route path="/notifications" element={<NotificationsPage />} />

          {/* REMEDIATIONS */}
          <Route path="/remediations" element={<Remediations />} />

          {/* SETTINGS */}
          <Route path="/settings" element={<Settings />} />
        </Route>

        {/* FALLBACK */}
        <Route
          path="*"
          element={isAuthenticated() ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default Router;