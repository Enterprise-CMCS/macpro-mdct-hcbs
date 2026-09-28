import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RouterWrappedComponent } from "utils/testing/setupTests";
import { LoginCognito } from "components";
import { testA11yAct } from "utils/testing/commonTests";
import { signIn } from "aws-amplify/auth";
import { useNavigate } from "react-router-dom";

vi.mock("aws-amplify/auth");
vi.mock("react-router-dom", () => ({
  useNavigate: vi.fn().mockReturnValue(vi.fn()),
}));
const mockNavigate = useNavigate();

const loginCognitoComponent = (
  <RouterWrappedComponent>
    <LoginCognito />
  </RouterWrappedComponent>
);

describe("<LoginCognito />", () => {
  it("should call amplify auth login", async () => {
    render(loginCognitoComponent);

    await userEvent.type(screen.getByLabelText("Email"), "email@address.com");
    await userEvent.type(screen.getByLabelText("Password"), "p@$$w0rd"); //pragma: allowlist secret
    await userEvent.click(screen.getByRole("button"));

    expect(signIn).toHaveBeenCalledWith({
      username: "email@address.com",
      password: "p@$$w0rd", //pragma: allowlist secret
    });
    expect(mockNavigate).toHaveBeenCalledWith("/");
  });

  testA11yAct(loginCognitoComponent);
});
