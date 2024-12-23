import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TemplateCard } from "components";
import { mockUseStore, RouterWrappedComponent } from "utils/testing/setupJest";
import { useStore } from "utils";
import verbiage from "verbiage/pages/home";
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

const qmTemplateVerbiage = verbiage.cards.QMS;

const qmTemplateCardComponent = (
  <RouterWrappedComponent>
    <TemplateCard templateName="QMS" verbiage={qmTemplateVerbiage} />
  </RouterWrappedComponent>
);

describe("<TemplateCard />", () => {
  describe("Renders", () => {
    beforeEach(() => {
      render(qmTemplateCardComponent);
    });

    test("QMS TemplateCard is visible", () => {
      expect(screen.getByText(qmTemplateVerbiage.title)).toBeVisible();
    });

    test("QMS TemplateCard image is visible on desktop", () => {
      const imageAltText = "Spreadsheet icon";
      expect(screen.getByAltText(imageAltText)).toBeVisible();
    });

    test("QMS TemplateCard link is visible on desktop", () => {
      const templateCardLink = qmTemplateVerbiage.link.text;
      expect(screen.getByText(templateCardLink)).toBeVisible();
    });

    test("QMS TemplateCard navigates to next route on link click", async () => {
      const templateCardLink = screen.getByText(qmTemplateVerbiage.link.text)!;
      await userEvent.click(templateCardLink);
      const expectedRoute = "/report/QMS/MN";
      expect(mockUseNavigate).toHaveBeenCalledWith(expectedRoute);
    });
  });

  testA11y(qmTemplateCardComponent);
});
