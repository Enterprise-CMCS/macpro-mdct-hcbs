import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { ReportIntroCard } from "components";
import { RouterWrappedComponent } from "utils/testing/setupTests";
import { testA11y } from "utils/testing/commonTests";

vi.mock("utils/other/useBreakpoint", () => ({
  useBreakpoint: vi.fn(() => ({
    isDesktop: true,
  })),
}));

const mockUseNavigate = vi.fn();

vi.mock("react-router-dom", () => ({
  useNavigate: () => mockUseNavigate,
}));

const qmsReportTypeCardComponent = (
  <RouterWrappedComponent>
    <ReportIntroCard title="Quality Measure Set">
      This is the body of the report intro card. Normally it would contain a
      description of the report, as well as an instance of
      <code>&lt;IntroCardActions&gt;</code>
    </ReportIntroCard>
  </RouterWrappedComponent>
);

describe("<ReportTypeCard />", () => {
  it("should render correctly", () => {
    render(qmsReportTypeCardComponent);
    expect(screen.getByText("Quality Measure Set")).toBeVisible();
    expect(screen.getByAltText("Spreadsheet icon")).toBeVisible();
  });

  testA11y(qmsReportTypeCardComponent);
});
