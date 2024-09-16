import { Route, Routes } from "react-router-dom";
import { HelpPage, HomePage, ProfilePage } from "components";
import { ExampleForm } from "components/pages/ExampleForm/ExampleForm";
import { ReportPageWrapper } from "components/Example/ReportPageWrapper";

export const AppRoutes = () => {
  return (
    <main id="main-content" tabIndex={-1}>
      <Routes>
        {/* General Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/help" element={<HelpPage />} />
        <Route path="/report/QM" element={<ExampleForm />} />
        <Route
          path="/report/:reportType/:state/:reportId"
          element={<ReportPageWrapper></ReportPageWrapper>}
        ></Route>
      </Routes>
    </main>
  );
};
