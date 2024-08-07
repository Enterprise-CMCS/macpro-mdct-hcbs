import { render, screen } from "@testing-library/react";
import { act } from "react-dom/test-utils";
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
    expect(screen.getByTestId("app-container")).toBeVisible();
  });

  test("App renders local logins if there is no user", async () => {
    mockedUseStore.mockReturnValue(mockNoUserStore);
    await act(async () => {
      await render(appComponent);
    });
    expect(screen.getByTestId("login-container")).toBeVisible();
  });

  testA11y(appComponent);
});
