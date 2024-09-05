import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ProfilePage } from "components";
import {
  mockAdminUserStore,
  mockStateUserStore,
  RouterWrappedComponent,
} from "utils/testing/setupJest";
import { useStore } from "utils";
import { testA11y } from "utils/testing/commonTests";

const ProfilePageComponent = (
  <RouterWrappedComponent>
    <ProfilePage />
  </RouterWrappedComponent>
);

// MOCKS

jest.mock("utils/state/useStore");
const mockedUseStore = useStore as jest.MockedFunction<typeof useStore>;

// TESTS

describe("Test ProfilePage for admin users", () => {
  beforeEach(() => {
    mockedUseStore.mockReturnValue(mockAdminUserStore);
    render(ProfilePageComponent);
  });
  test("Check that Profile page renders properly", () => {
    const rows = screen.getAllByRole("row");
    expect(rows[0]).toHaveTextContent("adminuser@test.com");
  });

  test("Check that there is a banner editor button visible", () => {
    const buttons = screen.getAllByRole("button");
    expect(buttons[0]).toHaveTextContent("Banner Editor");
  });

  test("Check that the state field is set to N/A", () => {
    expect(screen.getByText("State")).toBeVisible();
    expect(screen.getByText("N/A")).toBeVisible();
  });

  test("Check that admin button navigates to /admin on click", async () => {
    const adminButtons = screen.getAllByRole("button");
    await userEvent.click(adminButtons[0]);
    expect(window.location.pathname).toEqual("/admin");
  });
});

describe("Test ProfilePage for state users", () => {
  beforeEach(() => {
    mockedUseStore.mockReturnValue(mockStateUserStore);
    render(ProfilePageComponent);
  });

  test("Check that Profile page renders properly", () => {
    const elements = screen.getAllByText("stateuser@test.com");
    expect(elements[0]).toBeInTheDocument();
  });

  test("Check that state is visible and set accordingly", () => {
    const elements = screen.getAllByText("State");
    expect(elements[0]).toBeInTheDocument();
    expect(screen.getByText("MN")).toBeVisible();
  });

  test("Check that there is not a banner editor button", () => {
    expect(screen.queryByText("Banner Editor")).not.toBeInTheDocument();
  });
});

describe("Test ProfilePage accessibility", () => {
  mockedUseStore.mockReturnValue(mockAdminUserStore);
  render(ProfilePageComponent);
  testA11y(ProfilePageComponent);
});
