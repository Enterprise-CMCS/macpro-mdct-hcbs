import { Navigate, Route, Routes } from "react-router-dom";
import {
  AdminPage,
  CreateReportOptions,
  HelpPage,
  HomePage,
  ProfilePage,
  DashboardPage,
  NotFoundPage,
  AdminBannerProvider,
  ExportedReportPage,
  ReportPageWrapper,
} from "components";
import { useStore } from "utils";

export const AppRoutes = () => {
  const { userIsAdmin } = useStore().user ?? {};

  return (
    <main id="main-content" tabIndex={-1}>
      <AdminBannerProvider>
        <Routes>
          {/* General Routes */}
          <Route path="/" element={<HomePage />} />
          <Route
            path="/admin"
            element={!userIsAdmin ? <Navigate to="/profile" /> : <AdminPage />}
          />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/help" element={<HelpPage />} />
          <Route path="*" element={<NotFoundPage />} />
          <Route
            path="/report/:reportType/:state"
            element={<DashboardPage />}
          />
          <Route path="/report/QMS" element={<CreateReportOptions />} />
          <Route
            path="/report/:reportType/:state/:reportId/export"
            element={<ExportedReportPage />}
          />
          <Route
            path="/report/:reportType/:state/:reportId/:pageId?"
            element={<ReportPageWrapper />}
          />
          {/* TO DO: Load pageId by default? */}
        </Routes>
      </AdminBannerProvider>
    </main>
  );
};
