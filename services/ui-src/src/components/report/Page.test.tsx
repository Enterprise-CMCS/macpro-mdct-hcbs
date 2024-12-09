import { useNavigate, useParams } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import { render, screen } from "@testing-library/react";
import { ElementType, PageElement } from "types/report";
import { useStore } from "utils";
import { mockUseStore } from "utils/testing/setupJest";
import { Page } from "./Page";

jest.mock("react-router-dom", () => ({
  useNavigate: jest.fn(),
  useParams: jest.fn(),
}));

jest.mock("utils/state/useStore");
const mockedUseStore = useStore as jest.MockedFunction<typeof useStore>;
mockedUseStore.mockReturnValue(mockUseStore);

jest.mock("react-hook-form", () => ({
  useFormContext: () => ({
    register: jest.fn(),
  }),
}));

// Mock the more complex elements, let them test themselves
jest.mock("./StatusTable", () => {
  return { StatusTableElement: () => <div>Status Table</div> };
});

const mockNavigate = jest.fn();
(useNavigate as jest.Mock).mockReturnValue(mockNavigate);
(useParams as jest.Mock).mockReturnValue({
  reportType: "exampleReport",
  state: "exampleState",
  reportId: "123",
});

const elements: PageElement[] = [
  {
    type: ElementType.Header,
    text: "My Header",
  },
  {
    type: ElementType.SubHeader,
    text: "My subheader",
  },
  {
    type: ElementType.Paragraph,
    text: "Paragraph",
  },
  {
    type: ElementType.Textbox,
    label: "labeled",
  },
  {
    type: ElementType.Date,
    label: "date label",
    helperText: "can you read this?",
  },
  {
    type: ElementType.Accordion,
    label: "Some text",
    value: "Other",
  },
  {
    type: ElementType.Radio,
    label: "date label",
    value: [{ label: "a", value: "1", checkedChildren: [] }],
  },
  {
    type: ElementType.ButtonLink,
    to: "report-page-id",
    label: "click me",
  },
  {
    type: ElementType.MeasureTable,
    measureDisplay: "stratified",
  },
  {
    type: ElementType.MeasureTable,
    measureDisplay: "required",
  },
  {
    type: ElementType.MeasureTable,
    measureDisplay: "optional",
  },
  {
    type: ElementType.StatusTable,
  },
  {
    type: ElementType.QualityMeasureTable,
    measureDisplay: "quality",
  },
];

describe("Page Component", () => {
  test.each(elements)("Renders all element types: %p", (element) => {
    const { container } = render(<Page elements={[element]} />);
    expect(container).not.toBeEmptyDOMElement();
  });

  test("should render and navigate correctly for ButtonLink element", async () => {
    render(
      <Page
        elements={[
          {
            type: ElementType.ButtonLink,
            to: "report-page-id",
            label: "click me",
          },
        ]}
      />
    );

    // Button renders
    const button = screen.getByRole("button", { name: /click me/i });
    expect(button).toBeInTheDocument();

    // Navigation
    await userEvent.click(button);
    expect(mockNavigate).toHaveBeenCalledWith(
      "/report/exampleReport/exampleState/123/report-page-id"
    );
  });

  test("should not render if it is passed missing types", () => {
    // Page Element prevents us from doing this with typescript, but the real world may have other plans
    const badObject = { type: "unused element name" };

    const { container } = render(
      <Page elements={[badObject as unknown as PageElement]} />
    );
    expect(container).not.toBeEmptyDOMElement();
  });
});
