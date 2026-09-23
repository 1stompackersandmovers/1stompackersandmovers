import React from "react";
import { Route, Routes, Navigate } from "react-router";

import { useAuth } from "../../store/AuthContext";
import AdminPanelLayout from "./AdminPanelLayout";
import Login from "./pages/Auth/Login";
import LeadsList from "./pages/Leads/LeadsList";
import QuotesList from "./pages/Quotes/QuotesList";
import QuoteBuilder from "./pages/Quotes/QuoteBuilder";
import QuoteDetail from "./pages/Quotes/QuoteDetail";
import JobsList from "./pages/Jobs/JobsList";
import JobDetail from "./pages/Jobs/JobDetail";
import InvoicesList from "./pages/Invoices/InvoicesList";
import InvoiceBuilder from "./pages/Invoices/InvoiceBuilder";
import InvoiceView from "./pages/Invoices/InvoiceView";
import BiltiesList from "./pages/Bilties/BiltiesList";
import BiltyBuilder from "./pages/Bilties/BiltyBuilder";
import BiltyView from "./pages/Bilties/BiltyView";
import Settings from "./pages/Settings/Settings";
import NotFound from "./shared/components/NotFound";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-500 text-sm">
        Authenticating session...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const AdminPanelRoutes = () => {
  return (
    <Routes>
      {/* Public Login Route */}
      <Route path="/login" element={<Login />} />

      {/* Protected Operations Routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AdminPanelLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/leads" replace />} />

        {/* Leads */}
        <Route path="leads" element={<LeadsList />} />

        {/* Quotes */}
        <Route path="quotes" element={<QuotesList />} />
        <Route path="quotes/new" element={<QuoteBuilder />} />
        <Route path="quotes/:id" element={<QuoteDetail />} />

        {/* Jobs */}
        <Route path="jobs" element={<JobsList />} />
        <Route path="jobs/:id" element={<JobDetail />} />

        {/* Invoices */}
        <Route path="invoices" element={<InvoicesList />} />
        <Route path="invoices/new" element={<InvoiceBuilder />} />
        <Route path="invoices/:id" element={<InvoiceView />} />

        {/* Bilties */}
        <Route path="bilties" element={<BiltiesList />} />
        <Route path="bilties/new" element={<BiltyBuilder />} />
        <Route path="bilties/:id" element={<BiltyView />} />

        {/* Settings */}
        <Route path="settings" element={<Settings />} />

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default AdminPanelRoutes;
