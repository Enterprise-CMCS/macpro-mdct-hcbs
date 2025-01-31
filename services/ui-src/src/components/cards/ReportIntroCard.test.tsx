import { render, screen } from "@testing-library/react";
import { ReportIntroCard } from "components";
import { mockUseStore, RouterWrappedComponent } from "utils/testing/setupJest";
import { useStore } from "utils";
import { testA11y } from "utils/testing/commonTests";

jest.mock("utils/other/useBreakpoint", () => ({
  useBreakpoint: jest.fn(() => ({
    isDesktop: true,
  })),
}));

jest.mock("utils/state/useStore");
const mockedUseStore = useStore as jest.MockedFunction<typeof useStore>;
mockedUseStore.mockReturnValue(mockUseStore);

const mockUseNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  useNavigate: () => mockUseNavigate,
}));

const qmsReportTypeCardComponent = (
  <RouterWrappedComponent>
    <ReportIntroCard title="HCBS Quality Measure Set">
      This is the body of the report intro card. Normally it would contain a
      description of the report, as well as an instance of
      <code>&lt;IntroCardActions&gt;</code>
    </ReportIntroCard>
  </RouterWrappedComponent>
);

describe("<ReportTypeCard />", () => {
  describe("Renders", () => {
    beforeEach(() => {
      render(qmsReportTypeCardComponent);
    });

    test("QMS ReportTypeCard is visible", () => {
      expect(screen.getByText("HCBS Quality Measure Set")).toBeVisible();
    });

    test("QMS ReportTypeCard image is visible on desktop", () => {
      const imageAltText = "Spreadsheet icon";
      expect(screen.getByAltText(imageAltText)).toBeVisible();
    });
  });

  testA11y(qmsReportTypeCardComponent);
});
