import {
  mockUseReadOnlyUserStore,
  mockUseStore,
} from "utils/testing/setupJest";
import { useNavigate, useParams } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import { render, screen } from "@testing-library/react";
import { ElementType, PageElement } from "types/report";
import { useStore } from "utils";
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
    getValues: jest.fn(),
    setValue: jest.fn(),
  }),
  useWatch: jest.fn(),
  get: jest.fn(),
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
    id: "",
    text: "My Header",
  },
  {
    type: ElementType.SubHeader,
    id: "",
    text: "My subheader",
  },
  {
    type: ElementType.NestedHeading,
    id: "",
    text: "My nested heading",
  },
  {
    type: ElementType.MeasureDetails,
    id: "",
  },
  {
    type: ElementType.Paragraph,
    id: "",
    text: "Paragraph",
  },
  {
    type: ElementType.Textbox,
    id: "",
    label: "labeled",
  },
  {
    type: ElementType.TextAreaField,
    id: "",
    label: "labeled",
  },
  {
    type: ElementType.Date,
    id: "",
    label: "date label",
    helperText: "can you read this?",
  },
  {
    type: ElementType.Dropdown,
    id: "",
    label: "date label",
    helperText: "can you read this?",
    options: [{ label: "mock label", value: " mock value" }],
  },
  {
    type: ElementType.Accordion,
    id: "",
    label: "Some text",
    value: "Other",
  },
  {
    type: ElementType.Radio,
    id: "",
    label: "date label",
    value: [
      { label: "a", value: "1", checkedChildren: [] },
      { label: "b", value: "2" },
    ],
  },
  {
    type: ElementType.ReportingRadio,
    id: "",
    label: "label",
    value: [
      { label: "a", value: "1", checkedChildren: [] },
      { label: "b", value: "2" },
    ],
  },
  {
    type: ElementType.ButtonLink,
    to: "report-page-id",
    label: "click me",
    id: "",
  },
  {
    type: ElementType.MeasureTable,
    measureDisplay: "stratified",
    id: "",
  },
  {
    type: ElementType.MeasureTable,
    measureDisplay: "required",
    id: "",
  },
  {
    type: ElementType.MeasureTable,
    id: "",
    measureDisplay: "optional",
  },
  {
    type: ElementType.StatusTable,
    id: "",
  },
  {
    type: ElementType.MeasureResultsNavigationTable,
    id: "",
    measureDisplay: "quality",
  },
  {
    type: ElementType.MeasureFooter,
    id: "",
    prevTo: "mock-prev-page",
  },
];

const textFieldElement: PageElement[] = [
  {
    type: ElementType.Textbox,
    id: "",
    label: "labeled",
  },
  {
    type: ElementType.Radio,
    id: "",
    label: "radio button",
    value: [
      { label: "radio choice 1", value: "1", checkedChildren: [] },
      { label: "radio choice 2", value: "2" },
    ],
  },
];

const dateFieldElement: PageElement[] = [
  {
    type: ElementType.Date,
    id: "",
    label: "date label",
    helperText: "can you read this?",
  },
];

describe("Page Component with state user", () => {
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
            id: "",
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

describe("Page Component with read only user", () => {
  beforeEach(() => {
    mockedUseStore.mockReturnValue(mockUseReadOnlyUserStore);
  });
  test("text field and radio button should be disabled", () => {
    render(<Page elements={textFieldElement} />);
    const textField = screen.getByRole("textbox");
    const radioButton = screen.getByLabelText("radio choice 1");
    expect(textField).toBeDisabled();
    expect(radioButton).toBeDisabled();
  });
  test("date field should be disabled", () => {
    render(<Page elements={dateFieldElement} />);
    const dateField = screen.getByRole("textbox");
    expect(dateField).toBeDisabled();
  });
});
