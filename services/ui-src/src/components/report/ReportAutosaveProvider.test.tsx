import { beforeEach, describe, expect, it, vi } from "vitest";
import { useContext } from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RouterWrappedComponent } from "utils/testing/setupTests";
import {
  ReportAutosaveContext,
  ReportAutosaveProvider,
} from "./ReportAutosaveProvider";
import { useStore } from "utils/state/useStore";
import { Report } from "types";

useStore.setState({
  report: { id: "test-report" } as Report,
  saveReport: vi.fn(),
});

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

describe("<UserProvider />", () => {
  beforeEach(async () => {
    render(testComponent);
  });

  it("should render its children", () => {
    expect(screen.getByText("Save Test")).toBeVisible();
  });

  it("should call the save function", async () => {
    const saveButton = screen.getByRole("button", { name: "Save" });
    await userEvent.click(saveButton);
    await waitFor(
      () => expect(useStore.getState().saveReport).toHaveBeenCalled(),
      { timeout: 3000 }
    );
  });
});
