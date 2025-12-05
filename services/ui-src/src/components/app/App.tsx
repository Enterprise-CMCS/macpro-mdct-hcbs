import { useContext, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import {
  AppRoutes,
  Error,
  Header,
  LoginCognito,
  LoginIDM,
  PostLogoutRedirect,
  Footer,
  Timeout,
} from "components";
import { Container, Divider, Flex, Heading, Stack } from "@chakra-ui/react";
import { ErrorBoundary } from "react-error-boundary";
import {
  fireTealiumPageView,
  makeMediaQueryClasses,
  UserContext,
  useStore,
} from "utils";

export const App = () => {
  const mqClasses = makeMediaQueryClasses();
  const context = useContext(UserContext);
  const { logout } = context;
  const { user, showLocalLogins } = useStore();
  const { pathname, key } = useLocation();

  const isExportPage = pathname.includes("/export");

  // fire tealium page view on route change
  useEffect(() => {
    fireTealiumPageView(user, window.location.href, pathname);
  }, [key]);

  const authenticatedRoutes = (
    <>
      {user && (
        <Flex sx={sx.appLayout}>
          <Timeout />
          {!isExportPage && <Header handleLogout={logout} />}
          <Container sx={sx.appContainer}>
            <ErrorBoundary FallbackComponent={Error}>
              <AppRoutes />
            </ErrorBoundary>
          </Container>
          <Footer />
        </Flex>
      )}
      {!user && showLocalLogins && (
        <main>
          <Container sx={sx.appContainer}>
            <Heading as="h1" fontSize="heading_3xl" variant="login">
              Learning &amp; Building Sandbox
            </Heading>
          </Container>
          <Container sx={sx.loginContainer}>
            <Stack spacing={8}>
              <LoginIDM />
              <Divider />
              <LoginCognito />
            </Stack>
          </Container>
        </main>
      )}
    </>
  );

  return (
    <div id="app-wrapper" className={mqClasses}>
      <Routes>
        <Route path="*" element={authenticatedRoutes} />
        <Route path="postLogout" element={<PostLogoutRedirect />} />
      </Routes>
    </div>
  );
};

const sx = {
  appLayout: {
    minHeight: "100vh",
    flexDirection: "column",
  },
  appContainer: {
    display: "flex",
    maxW: "appMax",
    flex: "1 0 auto",
    padding: "0rem",
    section: {
      padding: "0rem 2rem",
    },
    ".mobile &": {
      section: {
        padding: "1rem",
      },
    },
  },
  loginContainer: {
    maxWidth: "25rem",
    height: "full",
    marginY: "auto",
  },
};
