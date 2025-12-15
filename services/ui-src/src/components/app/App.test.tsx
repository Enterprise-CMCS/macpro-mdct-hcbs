import { render, screen } from "@testing-library/react";
import {
  RouterWrappedComponent,
  mockNoUserStore,
  mockUseStore,
} from "utils/testing/setupJest";
import { useStore, UserProvider } from "utils";
import { App } from "components";
import { testA11yAct } from "utils/testing/commonTests";

jest.mock("utils/state/useStore");
const mockedUseStore = useStore as jest.MockedFunction<typeof useStore>;
mockedUseStore.mockReturnValue(mockUseStore);

const appComponent = (
  <RouterWrappedComponent>
    <UserProvider>
      <App />
    </UserProvider>
  </RouterWrappedComponent>
);

describe("<App />", () => {
  test("App is visible", async () => {
    mockedUseStore.mockReturnValue(mockUseStore);
    render(appComponent);
    expect(
      screen.getByRole("region", {
        name: "Official website of the United States government",
      })
    ).toBeVisible();
    expect(
      screen.getByRole("button", { name: "Here's how you know" })
    ).toBeVisible();
    // Unable to run assertions on collections
    expect(screen.getAllByAltText("LABS logo")).toBeTruthy();
    expect(screen.getAllByAltText("Help")).toBeTruthy();
    expect(screen.getAllByAltText("Account")).toBeTruthy();
    expect(screen.getAllByAltText("Expand")).toBeTruthy();
    expect(
      screen.getAllByAltText("Department of Health and Human Services, USA")
    ).toBeTruthy();
    expect(
      screen.getAllByAltText("Medicaid.gov: Keeping America Healthy")
    ).toBeTruthy();
    expect(screen.getAllByRole("button").length).toBe(3);
  });

  test("App renders local logins if there is no user", async () => {
    mockedUseStore.mockReturnValue(mockNoUserStore);
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
