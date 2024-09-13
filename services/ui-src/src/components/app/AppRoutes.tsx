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
        <Route path="/qm" element={<ExampleForm />} />
        <Route
          key="/report"
          path="/report"
          element={<ReportPageWrapper></ReportPageWrapper>}
        ></Route>
      </Routes>
    </main>
  );
};
