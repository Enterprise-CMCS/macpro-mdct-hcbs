import { Route, Routes } from "react-router-dom";
import { HelpPage, ProfilePage } from "components";

export const AppRoutes = () => {
  return (
    <main id="main-content" tabIndex={-1}>
      <Routes>
        {/* General Routes */}
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/help" element={<HelpPage />} />
      </Routes>
    </main>
  );
};
