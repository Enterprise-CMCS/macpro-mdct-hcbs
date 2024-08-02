import { Route, Routes } from "react-router-dom";
import { HelpPage, HomePage } from "components";

export const AppRoutes = () => {
  return (
    <main id="main-content" tabIndex={-1}>
      <Routes>
        {/* General Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/help" element={<HelpPage />} />
      </Routes>
    </main>
  );
};
