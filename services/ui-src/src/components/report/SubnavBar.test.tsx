import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { RouterWrappedComponent } from "utils/testing/setupTests";
import { useStore } from "utils";
import { SubnavBar } from "./SubnavBar";
import { useParams } from "react-router-dom";
import { Report, ReportType } from "types";

vi.mock("react-router-dom", async (importOriginal) => ({
  ...(await importOriginal()),
  useParams: vi.fn(),
}));

const mockReport = {
  id: "1",
  name: "Sample Report",
  type: ReportType.QMS,
  state: "CO",
} as Report;

const renderSubnavBar = () =>
  render(
    <RouterWrappedComponent>
      <SubnavBar />
    </RouterWrappedComponent>
  );

describe("SubnavBar component", () => {
  beforeEach(() => {
    useStore.setState({
      report: mockReport,
      lastSavedTime: "2 minutes ago",
    });
    vi.mocked(useParams).mockReturnValue({
      reportType: "mockType",
      state: "mockState",
    });
  });

  it("should render correctly", () => {
    renderSubnavBar();
    expect(screen.getByText(/Sample Report/)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Leave form" })).toBeVisible();
  });

  it("should display last saved time and check icon", () => {
    renderSubnavBar();
    expect(screen.getByText(/Last saved 2 minutes ago/)).toBeInTheDocument();
    expect(screen.getByAltText(/gray checkmark icon/)).toBeInTheDocument();
  });

  it("should not display last saved time or check icon if lastSavedTime is falsy", () => {
    useStore.setState({
      report: mockReport,
      lastSavedTime: "",
    });
    renderSubnavBar();
    expect(screen.queryByText(/Last saved/)).not.toBeInTheDocument();
    expect(
      screen.queryByAltText(/gray checkmark icon/)
    ).not.toBeInTheDocument();
  });
});
