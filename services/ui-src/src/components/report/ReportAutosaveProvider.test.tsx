import { useContext } from "react";
import { render, screen } from "@testing-library/react";
// utils
import { RouterWrappedComponent } from "utils/testing/setupJest";
import {
  ReportAutosaveContext,
  ReportAutosaveProvider,
} from "./ReportAutosaveProvider";

const mockSaveReport = jest.fn();

jest.mock("utils/state/useStore", () => ({
  ...jest.requireActual("utils/state/useStore"),
  saveReport: () => mockSaveReport,
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
});
