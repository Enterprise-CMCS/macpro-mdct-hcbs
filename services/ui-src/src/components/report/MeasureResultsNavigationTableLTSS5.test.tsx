import { MeasureResultsNavigationTableElementLTSS5 } from "./MeasureResultsNavigationTableLTSS5";
import { render, screen } from "@testing-library/react";
import { mockUseStore } from "utils/testing/setupJest";
import userEvent from "@testing-library/user-event";
import { useLiveElement } from "utils/state/hooks/useLiveElement";
import { ElementType } from "types/report";

jest.mock("utils/state/useStore", () => ({
  useStore: jest.fn().mockImplementation((selector: Function | undefined) => {
    if (selector) {
      return selector(mockUseStore);
    }
    return mockUseStore;
  }),
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
  value: [],
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

describe("Measure Results Navigation Table - LTSS5", () => {
  it("should enable each delivery system's button correctly", async () => {
    render(<MeasureResultsNavigationTableElementLTSS5 />);

    const part1Row = screen.getByRole("row", {
      name: /Part 1:/,
    });
    const part1Button = part1Row.querySelector("button");
    expect(part1Button).toBeEnabled();

    await userEvent.click(part1Button!);
    const part1Route = "/report/QMS/CO/mock-id/LTSS-5-PT1";
    expect(mockUseNavigate).toHaveBeenCalledWith(part1Route);

    const part2Row = screen.getByRole("row", {
      name: /Part 2:/,
    });
    const part2Button = part2Row.querySelector("button");
    expect(part2Button).toBeEnabled();

    await userEvent.click(part2Button!);
    const part2Route = "/report/QMS/CO/mock-id/LTSS-5-PT2";
    expect(mockUseNavigate).toHaveBeenCalledWith(part2Route);
  });
});
