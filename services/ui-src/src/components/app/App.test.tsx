import { render, screen, act } from "@testing-library/react";
import {
  RouterWrappedComponent,
  mockNoUserStore,
  mockUseStore,
} from "utils/testing/setupJest";
import { useStore, UserProvider } from "utils";
import { App } from "components";
import { testA11y } from "utils/testing/commonTests";

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
    await act(async () => {
      await render(appComponent);
    });
    expect(
      screen.getByRole("region", { name: "Official government website" })
    ).toBeVisible();
    expect(screen.getByRole("img", { name: "U.S. Flag" })).toBeVisible();
    // Unable to run assertions on collections
    expect(screen.getAllByAltText("HCBS logo"));
    expect(screen.getAllByAltText("Help"));
    expect(screen.getAllByAltText("Account"));
    expect(screen.getAllByAltText("Expand"));
    expect(
      screen.getAllByAltText("Department of Health and Human Services, USA")
    );
    expect(screen.getAllByAltText("Medicaid.gov: Keeping America Healthy"));
    expect(screen.getAllByRole("button").length).toBe(5);
  });

  test("App renders local logins if there is no user", async () => {
    mockedUseStore.mockReturnValue(mockNoUserStore);
    await act(async () => {
      await render(appComponent);
    });
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

  testA11y(appComponent);
});
