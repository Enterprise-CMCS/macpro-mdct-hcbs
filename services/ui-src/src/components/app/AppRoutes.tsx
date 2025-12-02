import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import {
  AdminPage,
  HelpPage,
  HomePage,
  ProfilePage,
  DashboardPage,
  NotFoundPage,
  AdminBannerProvider,
  ExportedReportPage,
  ReportPageWrapper,
  ComponentInventory,
} from "components";
import { useStore } from "utils";
import { useEffect } from "react";
import { useFlags } from "launchdarkly-react-client-sdk";
import { ReportAutosaveProvider } from "components/report/ReportAutosaveProvider";

export const AppRoutes = () => {
  const { userIsAdmin } = useStore().user ?? {};

  const { pathname } = useLocation();
  const isPdfActive = useFlags()?.viewPdf;
  const componentInventoryPageEnabled = useFlags()?.componentInventory;

  useEffect(() => {
    const appWrapper = document.getElementById("app-wrapper")!;
    appWrapper?.focus();
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <main id="main-content" tabIndex={-1}>
      <AdminBannerProvider>
        <ReportAutosaveProvider>
          <Routes>
            {/* General Routes */}
            <Route path="/" element={<HomePage />} />
            <Route
              path="/admin"
              element={
                !userIsAdmin ? <Navigate to="/profile" /> : <AdminPage />
              }
            />
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
          </Routes>
        </ReportAutosaveProvider>
      </AdminBannerProvider>
    </main>
  );
};
