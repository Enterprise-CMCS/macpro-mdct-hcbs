import { Route, Routes } from "react-router-dom";
import { HelpPage, HomePage, ProfilePage } from "components";
import { ReportPageWrapper } from "components/Example/ReportPageWrapper";

export const AppRoutes = () => {
  return (
    <main id="main-content" tabIndex={-1}>
      <Routes>
        {/* General Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/help" element={<HelpPage />} />
        <Route
          key="/report"
          path="/report"
          element={<ReportPageWrapper />}
        ></Route>
      </Routes>
    </main>
  );
};
