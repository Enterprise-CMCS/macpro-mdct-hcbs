import { useContext } from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
// utils
import { RouterWrappedComponent } from "utils/testing/setupJest";
import {
  ReportAutosaveContext,
  ReportAutosaveProvider,
} from "./ReportAutosaveProvider";

const mockSaveReport = jest.fn();

jest.mock("utils/state/useStore", () => ({
  useStore: () => ({
    report: { id: "test-report" },
    saveReport: mockSaveReport,
  }),
}));

// COMPONENTS

const TestComponent = () => {
  const { ...context } = useContext(ReportAutosaveContext);
  return (
    <div>
      <button onClick={() => context.autosave()}>Save</button>
      Save Test
    </div>
  );
};

const testComponent = (
  <RouterWrappedComponent>
    <ReportAutosaveProvider>
      <TestComponent />
    </ReportAutosaveProvider>
  </RouterWrappedComponent>
);

// TESTS

describe("<UserProvider />", () => {
  beforeEach(async () => {
    render(testComponent);
  });

  test("child component renders", () => {
    expect(screen.getByText("Save Test")).toBeVisible();
  });

  test("autosave function", async () => {
    const saveButton = screen.getByRole("button", { name: "Save" });
    await userEvent.click(saveButton);
    await waitFor(() => expect(mockSaveReport).toHaveBeenCalled(), {
      timeout: 3000,
    });
  });
});
