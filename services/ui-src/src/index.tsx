/* eslint-disable multiline-comment-style */

import { createRoot } from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";
import { Amplify } from "aws-amplify";
import config from "config";
import "aws-amplify/auth/enable-oauth-listener";
import { ApiProvider, UserProvider } from "utils";
import { asyncWithLDProvider } from "launchdarkly-react-client-sdk";
import { App, Error } from "components";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "styles/theme";
import "./styles/index.scss";

let apiRestConfig: any = {
  hcbs: {
    endpoint: config.apiGateway.URL,
    region: config.apiGateway.REGION,
  },
};

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: config.cognito.USER_POOL_ID,
      identityPoolId: config.cognito.IDENTITY_POOL_ID,
      userPoolClientId: config.cognito.APP_CLIENT_ID,
      loginWith: {
        oauth: {
          domain: config.cognito.APP_CLIENT_DOMAIN,
          redirectSignIn: [config.cognito.REDIRECT_SIGNIN],
          redirectSignOut: [config.cognito.REDIRECT_SIGNOUT],
          scopes: ["email", "openid", "profile"],
          responseType: "code",
        },
      },
    },
  },
  API: {
    REST: {
      ...apiRestConfig,
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
    timeout: 2, // seconds
  });

  createRoot(document.getElementById("root")!).render(
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
    </ErrorBoundary>
  );
})().catch((e) => {
  throw e;
});
