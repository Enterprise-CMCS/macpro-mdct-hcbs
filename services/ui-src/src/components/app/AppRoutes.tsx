import { Route, Routes } from "react-router-dom";
import { HelpPage, HomePage, ProfilePage } from "components";

export const AppRoutes = () => {
  return (
    <main id="main-content" tabIndex={-1}>
      <Routes>
        {/* General Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/help" element={<HelpPage />} />
      </Routes>
    </main>
  );
};
