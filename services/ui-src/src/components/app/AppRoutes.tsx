import { Navigate, Route, Routes } from "react-router-dom";
import { useFlags } from "launchdarkly-react-client-sdk";

// components
import { HelpPage } from "components";

export const AppRoutes = () => {
  return (
    <main id="main-content" tabIndex={-1}>
      <Routes>
        {/* General Routes */}
        <Route path="/help" element={<HelpPage />} />
      </Routes>
    </main>
  );
};
