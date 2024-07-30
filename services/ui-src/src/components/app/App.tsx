import { useContext } from "react";
import { Routes, Route } from "react-router-dom";
import { Container, Divider, Flex, Heading, Stack } from "@chakra-ui/react";
import {
  Header,
  LoginCognito,
  LoginIDM,
  PostLogoutRedirect,
  Footer,
} from "components";
import { makeMediaQueryClasses, UserContext, useStore } from "utils";

export const App = () => {
  const mqClasses = makeMediaQueryClasses();
  const context = useContext(UserContext);
  const { logout } = context;
  const { user, showLocalLogins } = useStore();
  // const { pathname } = useLocation();

  // TODO: fire tealium page view on route change
  /*
   * useEffect(() => {
   * fireTealiumPageView(
   *   user,
   *   window.location.href,
   *   pathname,
   *   isApparentReportPage(pathname)
   * );
   * }, [key]);
   */

  const authenticatedRoutes = (
    <>
      {user && (
        <Flex data-testid="app-container" sx={sx.appLayout}>
          <Header handleLogout={logout} />
          <Footer />
        </Flex>
      )}
      {!user && showLocalLogins && (
        <main>
          <Container sx={sx.appContainer}>
            <Heading as="h1" size="xl" sx={sx.loginHeading}>
              Home &amp; Community Based Services
            </Heading>
          </Container>
          <Container sx={sx.loginContainer} data-testid="login-container">
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
  skipnav: {
    position: "absolute",
  },
  appContainer: {
    display: "flex",
    maxW: "appMax",
    flex: "1 0 auto",
    ".desktop &": {
      padding: "0 2rem",
    },
    "#main-content": {
      section: {
        flex: "1",
      },
    },
  },
  loginContainer: {
    maxWidth: "25rem",
    height: "full",
    marginY: "auto",
  },
  loginHeading: {
    my: "6rem",
    textAlign: "center",
    width: "100%",
  },
};
