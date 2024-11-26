import { Navigate, Route, Routes } from "react-router-dom";
import {
  AdminPage,
  HelpPage,
  HomePage,
  ProfilePage,
  DashboardPage,
  NotFoundPage,
  AdminBannerProvider,
  ExportedReportPage,
} from "components";
import { CreateReportOptions } from "components/pages/CreateReportOptions/CreateReportOptions";
import { ReportPageWrapper } from "components/report/ReportPageWrapper";
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
          <Route path="/report/QM" element={<CreateReportOptions />} />
          <Route
            path="/report/:reportType/:state/:reportId"
            element={<ReportPageWrapper />}
          />
          <Route
            path="/report/:reportType/:state/:reportId/export"
            element={<ExportedReportPage />}
          />
        </Routes>
      </AdminBannerProvider>
    </main>
  );
};
