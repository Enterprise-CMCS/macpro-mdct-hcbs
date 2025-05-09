import { MeasureResultsNavigationTableElement } from "./MeasureResultsNavigationTable";
import { render, screen } from "@testing-library/react";
import { mockUseStore } from "utils/testing/setupJest";
import userEvent from "@testing-library/user-event";
import { useLiveElement } from "utils/state/hooks/useLiveElement";
import {
  ElementType,
  MeasureResultsNavigationTableTemplate,
} from "types/report";

jest.mock("utils/state/useStore", () => ({
  useStore: jest
    .fn()
    .mockImplementation(
      (selector?: (state: typeof mockUseStore) => unknown) => {
        if (selector) {
          return selector(mockUseStore);
        }
        return mockUseStore;
      }
    ),
}));

jest.mock("utils/state/hooks/useLiveElement");
const mockedUseLiveElement = useLiveElement as jest.MockedFunction<
  typeof useLiveElement
>;
mockedUseLiveElement.mockReturnValue({
  type: ElementType.Radio,
  id: "anId",
  answer: "FFS",
  label: "how are you today?",
  choices: [],
});

const mockUseNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockUseNavigate,
  useParams: jest.fn(() => ({
    reportType: "QMS",
    state: "CO",
    reportId: "mock-id",
  })),
}));

const mockedMeasureResultsNavigationTableElement: MeasureResultsNavigationTableTemplate =
  {
    type: ElementType.MeasureResultsNavigationTable,
    id: "test measure results table",
    measureDisplay: "quality",
    hideCondition: {
      controllerElementId: "reporting-radio",
      answer: "yes",
    },
  };

const MeasureResultsNavigationTableComponent = (
  <MeasureResultsNavigationTableElement
    element={mockedMeasureResultsNavigationTableElement}
    index={0}
    formkey="elements.0"
  />
);

describe("Measure Results Navigation Table", () => {
  it("should enable each delivery system's button correctly", async () => {
    render(MeasureResultsNavigationTableComponent);

    const ffsRow = screen.getByRole("row", {
      name: /Delivery Method: Fee-for-Service/,
    });
    const ffsButton = ffsRow.querySelector("button");
    expect(ffsButton).toBeEnabled();

    await userEvent.click(ffsButton!);
    const ffsRoute = "/report/QMS/CO/mock-id/FFS-1";
    expect(mockUseNavigate).toHaveBeenCalledWith(ffsRoute);

    const mltssRow = screen.getByRole("row", {
      name: /Delivery Method: Managed Care/,
    });
    const mltssButton = mltssRow.querySelector("button");
    expect(mltssButton).toBeDisabled();
  });
});
