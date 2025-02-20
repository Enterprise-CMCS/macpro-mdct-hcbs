import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MeasureTableElement } from "./MeasureTable";
import { mockMeasureTemplate, mockUseStore } from "utils/testing/setupJest";
import { useStore } from "utils/state/useStore";
import { ElementType, MeasurePageTemplate, PageElement } from "types";
import { MemoryRouter } from "react-router-dom";

jest.mock("utils/state/useStore");
const mockedUseStore = useStore as jest.MockedFunction<typeof useStore>;
mockedUseStore.mockReturnValue(mockUseStore);

const mockedMeasureTableElement = {
  type: ElementType.MeasureTable,
  measureDisplay: "required",
};

jest.mock("./MeasureReplacementModal", () => ({
  MeasureReplacementModal: (
    _measure: MeasurePageTemplate,
    _onClose: Function,
    onSubmit: Function
  ) => {
    onSubmit(mockMeasureTemplate);
  },
}));

const MeasureTableComponent = (
  <MemoryRouter>
    <MeasureTableElement
      element={mockedMeasureTableElement as unknown as PageElement}
      formkey={""}
    ></MeasureTableElement>
  </MemoryRouter>
);

/* To do: add real test */
describe("Test MeasureTable", () => {
  beforeEach(() => {
    render(MeasureTableComponent);
  });
  it("Test MeasureTable render", () => {
    expect(screen.getByText("mock-title")).toBeInTheDocument();
  });
  it("Test Sustitute button", async () => {
    const substituteBtn = screen.getByText("Substitute measure");
    await userEvent.click(substituteBtn);
  });
  it("Test Edit button", async () => {
    const editBtn = screen.getAllByText("Edit")[0];
    await userEvent.click(editBtn);
  });
});
