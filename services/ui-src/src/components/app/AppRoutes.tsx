import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { ReportAutosaveProvider } from "components/report/ReportAutosaveProvider";
import { ComponentInventory } from "components/component-inventory/ComponentInventory";
import { AdminPage } from "components/pages/AdminPage";
import { DashboardPage } from "components/pages/DashboardPage";
import { ExportedReportPage } from "components/pages/ExportedReportPage";
import { HelpPage } from "components/pages/HelpPage";
import { HomePage } from "components/pages/HomePage";
import { NotFoundPage } from "components/pages/NotFoundPage";
import { NotificationsPage } from "components/pages/NotificationsPage";
import { ProfilePage } from "components/pages/ProfilePage";
import { ReportPageWrapper } from "components/pages/ReportPageWrapper";
import { useStore } from "utils";
import { useEffect } from "react";
import { useFlags } from "launchdarkly-react-client-sdk";

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
