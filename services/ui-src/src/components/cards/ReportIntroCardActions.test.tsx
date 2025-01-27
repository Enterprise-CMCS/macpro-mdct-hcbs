import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  downloadUserGuide,
  ReportIntroCardActions,
} from "./ReportIntroCardActions";
import { mockUseStore, RouterWrappedComponent } from "utils/testing/setupJest";
import { useStore, getSignedTemplateUrl } from "utils";
import { testA11y } from "utils/testing/commonTests";
import { ReportType } from "types";

jest.mock("../../utils/api/requestMethods/getTemplateUrl", () => ({
  getSignedTemplateUrl: jest
    .fn()
    .mockResolvedValue("https://mdcthcbs.cms.gov/qms/userGuide.pdf"),
}));

const mockCreateElement = jest.spyOn(document, "createElement");
const mockClick = jest.fn();
const mockSetAttribute = jest.fn();
const mockRemove = jest.fn();

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

const reportActionsComponent = (
  <RouterWrappedComponent>
    <ReportIntroCardActions reportType={ReportType.QMS} />
  </RouterWrappedComponent>
);

describe("<ReportIntroCardActions />", () => {
  describe("Renders", () => {
    beforeEach(() => {
      render(reportActionsComponent);
    });

    test("QMS ReportTypeCard link is visible on desktop", () => {
      const downloadButton = screen.getByRole("button", {
        name: "User Guide and Help File",
      });
      expect(downloadButton).toBeVisible();
    });

    test("QMS ReportTypeCard navigates to next route on link click", async () => {
      const dashboardLink = screen.getByRole("button", {
        name: "Enter HCBS QMS online",
      });
      await userEvent.click(dashboardLink);
      const expectedRoute = "/report/QMS/MN";
      expect(mockUseNavigate).toHaveBeenCalledWith(expectedRoute);
    });
  });

  describe("downloadTemplate", () => {
    beforeEach(() => {
      mockCreateElement.mockReturnValueOnce({
        setAttribute: mockSetAttribute,
        click: mockClick,
        remove: mockRemove,
      } as unknown as HTMLAnchorElement);
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    test("should download the template when called", async () => {
      const reportType = ReportType.QMS;

      await downloadUserGuide(reportType);

      expect(getSignedTemplateUrl).toHaveBeenCalledWith(reportType);
      expect(mockSetAttribute).toHaveBeenCalledWith("target", "_blank");
      expect(mockSetAttribute).toHaveBeenCalledWith(
        "href",
        "https://mdcthcbs.cms.gov/qms/userGuide.pdf"
      );
      expect(mockClick).toHaveBeenCalled();
      expect(mockRemove).toHaveBeenCalled();
    });
  });

  testA11y(reportActionsComponent);
});
