import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RouterWrappedComponent } from "utils/testing/setupJest";
import { LoginCognito } from "components";
import { testA11yAct } from "utils/testing/commonTests";

const loginCognitoComponent = (
  <RouterWrappedComponent>
    <LoginCognito />
  </RouterWrappedComponent>
);

const mockSignIn = jest.fn();
jest.mock("aws-amplify/auth", () => ({
  signIn: (credentials: { username: string; password: string }) =>
    mockSignIn(credentials),
}));

const mockUseNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  useNavigate: () => mockUseNavigate,
}));

describe("<LoginCognito />", () => {
  describe("Renders", () => {
    beforeEach(() => {
      render(loginCognitoComponent);
    });

    test("LoginCognito login calls amplify auth login", async () => {
      const emailInput = screen.getByLabelText("Email");
      const passwordInput = screen.getByLabelText("Password");
      const submitButton = screen.getByRole("button");
      await userEvent.type(emailInput, "email@address.com");
      await userEvent.type(passwordInput, "p@$$w0rd"); //pragma: allowlist secret
      await userEvent.click(submitButton);
      expect(mockSignIn).toHaveBeenCalledWith({
        username: "email@address.com",
        password: "p@$$w0rd", //pragma: allowlist secret
      });
      expect(mockUseNavigate).toHaveBeenCalledWith("/");
    });
  });

  testA11yAct(loginCognitoComponent);
});
