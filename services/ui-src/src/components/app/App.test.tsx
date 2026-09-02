import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { RouterWrappedComponent } from "utils/testing/setupTests";
import { useStore, UserProvider, fireTealiumPageView } from "utils";
import { App } from "components";
import { testA11yAct } from "utils/testing/commonTests";
import { HcbsUser } from "types";

vi.mock("utils", async (importOriginal) => ({
  ...(await importOriginal()),
  fireTealiumPageView: vi.fn(),
}));

const appComponent = (
  <RouterWrappedComponent>
    <UserProvider>
      <App />
    </UserProvider>
  </RouterWrappedComponent>
);

describe("<App />", () => {
  it("should render the home page for a logged-in user", async () => {
    useStore.setState({ user: {} as HcbsUser });
    render(appComponent);

    expect(fireTealiumPageView).toHaveBeenCalled();

    expect(
      screen.getByRole("region", {
        name: "Official website of the United States government",
      })
    ).toBeVisible();
    expect(
      screen.getByRole("button", { name: "Here's how you know" })
    ).toBeVisible();
    expect(screen.getAllByAltText("HCBS logo")[0]).toBeVisible();
    expect(screen.getAllByAltText("Help")[0]).toBeVisible();
    expect(screen.getAllByAltText("Account")[0]).toBeVisible();
    expect(
      screen.getAllByAltText(/Health and Human Services/)[0]
    ).toBeVisible();
    expect(
      screen.getAllByAltText("Medicaid.gov: Keeping America Healthy")[0]
    ).toBeVisible();
    expect(screen.getByRole("button", { name: /my account/i })).toBeVisible();
    expect(
      screen.getByRole("button", { name: /select state or territory/i })
    ).toBeVisible();
    expect(
      screen.getByRole("button", { name: /report dashboard/i })
    ).toBeVisible();
  });

  it("should render the login page if there is no user", async () => {
    useStore.setState({ user: undefined });
    render(appComponent);
    const headings = screen.getAllByRole("heading", { level: 2 });
    expect(headings.length).toBe(2);
    expect(headings[0]).toHaveTextContent("Log In with IDM");
    expect(headings[1]).toHaveTextContent("Log In with Cognito");
    expect(
      screen.getByRole("button", { name: "Log In with IDM" })
    ).toBeVisible();
    expect(
      screen.getByRole("button", { name: "Log In with Cognito" })
    ).toBeVisible();
  });

  testA11yAct(appComponent);
});
