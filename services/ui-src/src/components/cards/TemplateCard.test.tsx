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

const qmTemplateVerbiage = verbiage.cards.QM;

const qmTemplateCardComponent = (
  <RouterWrappedComponent>
    <TemplateCard templateName="QM" verbiage={qmTemplateVerbiage} />
  </RouterWrappedComponent>
);

describe("<TemplateCard />", () => {
  describe("Renders", () => {
    beforeEach(() => {
      render(qmTemplateCardComponent);
    });

    test("QM TemplateCard is visible", () => {
      expect(screen.getByText(qmTemplateVerbiage.title)).toBeVisible();
    });

    test("QM TemplateCard image is visible on desktop", () => {
      const imageAltText = "Spreadsheet icon";
      expect(screen.getByAltText(imageAltText)).toBeVisible();
    });

    test("QM TemplateCard link is visible on desktop", () => {
      const templateCardLink = qmTemplateVerbiage.link.text;
      expect(screen.getByText(templateCardLink)).toBeVisible();
    });

    test("QM TemplateCard navigates to next route on link click", async () => {
      const templateCardLink = screen.getByText(qmTemplateVerbiage.link.text)!;
      await userEvent.click(templateCardLink);
      const expectedRoute = "/report/QM/MN";
      expect(mockUseNavigate).toHaveBeenCalledWith(expectedRoute);
    });
  });

  testA11y(qmTemplateCardComponent);
});
