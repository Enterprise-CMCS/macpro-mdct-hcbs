import { Route, Routes } from "react-router-dom";
import {
  HelpPage,
  HomePage,
  ProfilePage,
  DashboardPage,
  NotFoundPage,
  ExportedReportPage,
} from "components";
import { CreateReportOptions } from "components/pages/CreateReportOptions/CreateReportOptions";
import { ReportPageWrapper } from "components/report/ReportPageWrapper";

export const AppRoutes = () => {
  return (
    <main id="main-content" tabIndex={-1}>
      <Routes>
        {/* General Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/help" element={<HelpPage />} />
        <Route path="*" element={<NotFoundPage />} />
        <Route path="/report/:reportType/:state" element={<DashboardPage />} />
        <Route path="/report/QM" element={<CreateReportOptions />} />
        <Route
          path="/report/:reportType/:state/:reportId"
          element={<ReportPageWrapper />}
        ></Route>
        <Route
          path="/report/:reportType/:state/:reportId/export"
          element={<ExportedReportPage />}
        ></Route>
      </Routes>
    </main>
  );
};
