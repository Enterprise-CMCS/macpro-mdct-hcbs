import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ProfilePage } from "components";
import {
  mockAdminUserStore,
  mockStateUserStore,
  RouterWrappedComponent,
} from "utils/testing/setupJest";
import { useStore } from "utils";
import { testA11yAct } from "utils/testing/commonTests";

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
  beforeEach(async () => {
    mockedUseStore.mockReturnValue(mockAdminUserStore);
    render(ProfilePageComponent);
  });

  test("Check that Profile page renders properly", () => {
    expect(
      screen.getByRole("row", { name: "Email adminuser@test.com" })
    ).toBeVisible();
    expect(screen.queryByText("stateuser@test.com")).not.toBeInTheDocument();
  });

  test("Check that there is a banner editor button visible", () => {
    expect(screen.getByRole("button", { name: "Banner Editor" })).toBeVisible();
  });

  test("Check that the state field is set to N/A", () => {
    expect(screen.getByText("State")).toBeVisible();
    expect(screen.getByText("N/A")).toBeVisible();
  });

  test("Check that admin button navigates to /admin on click", async () => {
    const adminButton = screen.getByRole("button", { name: "Banner Editor" });
    await userEvent.click(adminButton);
    expect(window.location.pathname).toEqual("/admin");
  });
});

describe("Test ProfilePage for state users", () => {
  beforeEach(async () => {
    mockedUseStore.mockReturnValue(mockStateUserStore);
    render(ProfilePageComponent);
  });

  test("Check that Profile page renders properly", () => {
    expect(
      screen.getByRole("row", { name: "Email stateuser@test.com" })
    ).toBeVisible();
    expect(screen.queryByText("adminuser@test.com")).not.toBeInTheDocument();
  });

  test("Check that state is visible and set accordingly", () => {
    expect(screen.getByText("State")).toBeVisible();
    expect(screen.getByText("MN")).toBeVisible();
  });

  test("Check that there is not a banner editor button", () => {
    expect(screen.queryByText("Banner Editor")).not.toBeInTheDocument();
  });
});

describe("Test ProfilePage accessibility", () => {
  mockedUseStore.mockReturnValue(mockAdminUserStore);
  testA11yAct(ProfilePageComponent);
});
