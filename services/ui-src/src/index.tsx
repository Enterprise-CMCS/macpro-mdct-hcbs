/* eslint-disable multiline-comment-style */

import ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";
import { Amplify } from "aws-amplify";
import config from "config";
import { ApiProvider, UserProvider } from "utils";
import { asyncWithLDProvider } from "launchdarkly-react-client-sdk";
import { App, Error } from "components";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "styles/theme";
import "./styles/index.scss";

Amplify.configure({
  Auth: {
    mandatorySignIn: true,
    region: config.cognito.REGION,
    userPoolId: config.cognito.USER_POOL_ID,
    identityPoolId: config.cognito.IDENTITY_POOL_ID,
    userPoolWebClientId: config.cognito.APP_CLIENT_ID,
    oauth: {
      domain: config.cognito.APP_CLIENT_DOMAIN,
      redirectSignIn: config.cognito.REDIRECT_SIGNIN,
      redirectSignOut: config.cognito.REDIRECT_SIGNOUT,
      scope: ["email", "openid", "profile"],
      responseType: "code",
    },
  },
});
// LaunchDarkly configuration
const ldClientId = config.REACT_APP_LD_SDK_CLIENT;
(async () => {
  const LDProvider = await asyncWithLDProvider({
    clientSideID: ldClientId!,
    options: {
      baseUrl: "https://clientsdk.launchdarkly.us",
      streamUrl: "https://clientstream.launchdarkly.us",
      eventsUrl: "https://events.launchdarkly.us",
    },
    deferInitialization: false,
  });

  ReactDOM.render(
    <ErrorBoundary FallbackComponent={Error}>
      <Router>
        <UserProvider>
          <ApiProvider>
            <ChakraProvider theme={theme}>
              <LDProvider>
                <App />
              </LDProvider>
            </ChakraProvider>
          </ApiProvider>
        </UserProvider>
      </Router>
    </ErrorBoundary>,
    document.getElementById("root")
  );
})().catch((e) => {
  throw e;
});
