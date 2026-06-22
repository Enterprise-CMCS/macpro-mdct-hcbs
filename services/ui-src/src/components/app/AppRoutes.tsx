import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { HomePage } from "components/layout/HomePage";
import { AdminPage } from "components/pages/AdminPage";
import { HelpPage } from "components/pages/HelpPage";
import { ProfilePage } from "components/pages/ProfilePage";
import { NotFoundPage } from "components/pages/NotFoundPage";
import { ExportedReportPage } from "components/pages/ExportedReportPage";
import { ComponentInventory } from "components/component-inventory/ComponentInventory";
import { DashboardPage } from "components/pages/DashboardPage";
import { ReportPageWrapper } from "components/report/ReportPageWrapper";
import { useStore } from "utils";
import { useEffect } from "react";
import { useFlags } from "launchdarkly-react-client-sdk";
import { ReportAutosaveProvider } from "components/report/ReportAutosaveProvider";
import { NotificationsPage } from "components/pages/NotificationsPage";

export const AppRoutes = () => {
  const { userIsAdmin } = useStore().user ?? {};

  const { pathname } = useLocation();
  const isPdfActive = useFlags()?.viewPdf;
  const componentInventoryPageEnabled = useFlags()?.componentInventory;
  const notificationsPageEnabled = useFlags()?.notificationsSystem;

  useEffect(() => {
    document.getElementById("app-wrapper")!.focus();
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <main id="main-content" tabIndex={-1}>
      <ReportAutosaveProvider>
        <Routes>
          {/* General Routes */}
          <Route path="/" element={<HomePage />} />
          <Route
            path="/admin"
            element={!userIsAdmin ? <Navigate to="/profile" /> : <AdminPage />}
          />
          {notificationsPageEnabled && (
            <Route
              path="/notifications"
              element={
                !userIsAdmin ? (
                  <Navigate to="/profile" />
                ) : (
                  <NotificationsPage />
                )
              }
            />
          )}
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/help" element={<HelpPage />} />
          <Route path="*" element={<NotFoundPage />} />
          <Route
            path="/report/:reportType/:state"
            element={<DashboardPage />}
          />
          {isPdfActive && (
            <Route
              path="/report/:reportType/:state/:reportId/export"
              element={<ExportedReportPage />}
            />
          )}
          <Route
            path="/report/:reportType/:state/:reportId/:pageId?"
            element={<ReportPageWrapper />}
          />
          {componentInventoryPageEnabled && (
            <Route
              path="/component-inventory"
              element={<ComponentInventory />}
            />
          )}
          {/* TO DO: Load pageId by default? */}
        </Routes>
      </ReportAutosaveProvider>
    </main>
  );
};
