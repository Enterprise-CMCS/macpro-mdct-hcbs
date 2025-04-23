import { render, screen } from "@testing-library/react";
import { RouterWrappedComponent, mockUseStore } from "utils/testing/setupJest";
import { useStore } from "utils";
import { SubnavBar } from "./SubnavBar";

jest.mock("utils/state/useStore");
const mockedUseStore = useStore as jest.MockedFunction<typeof useStore>;
mockedUseStore.mockReturnValue(mockUseStore);

describe("Test SubnavBar component", () => {
  test("SubnavBar is visible", () => {
    render(
      <RouterWrappedComponent>
        <SubnavBar stateName={"PR"} />
      </RouterWrappedComponent>
    );
    expect(screen.getByText("PR QMS Report")).toBeVisible();
    expect(screen.getByRole("link", { name: "Leave form" })).toBeVisible();
  });
});
