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

const xyzReportTypeCardComponent = (
  <RouterWrappedComponent>
    <ReportIntroCard title="XYZ">
      This is the body of the report intro card. Normally it would contain a
      description of the report, as well as an instance of
      <code>&lt;IntroCardActions&gt;</code>
    </ReportIntroCard>
  </RouterWrappedComponent>
);

describe("<ReportTypeCard />", () => {
  describe("Renders", () => {
    beforeEach(() => {
      render(xyzReportTypeCardComponent);
    });

    test("XYZ ReportTypeCard is visible", () => {
      expect(screen.getByText("XYZ")).toBeVisible();
    });

    test("XYZ ReportTypeCard image is visible on desktop", () => {
      const imageAltText = "Spreadsheet icon";
      expect(screen.getByAltText(imageAltText)).toBeVisible();
    });
  });

  testA11y(xyzReportTypeCardComponent);
});
