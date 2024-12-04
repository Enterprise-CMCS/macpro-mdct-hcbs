import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MeasureTableElement } from "./MeasureTable";
import { mockUseStore } from "utils/testing/setupJest";
import { useStore } from "utils/state/useStore";
import { ElementType, PageElement } from "types";

jest.mock("utils/state/useStore");
const mockedUseStore = useStore as jest.MockedFunction<typeof useStore>;
mockedUseStore.mockReturnValue(mockUseStore);

const mockedMeasureTableElement = {
  type: ElementType.MeasureTable,
  measureDisplay: "required",
};

const MeasureTableComponent = (
  <MeasureTableElement
    element={mockedMeasureTableElement as unknown as PageElement}
    formkey={""}
  ></MeasureTableElement>
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
    const editBtn = screen.getByText("Edit");
    await userEvent.click(editBtn);
  });
});
