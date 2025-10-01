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
import { AlertTypes } from "types";

jest.mock("react-router-dom", () => ({
  useNavigate: jest.fn(),
  useParams: jest.fn(),
}));

jest.mock("utils/state/useStore");
const mockedUseStore = useStore as jest.MockedFunction<typeof useStore>;
mockedUseStore.mockImplementation(
  (selector?: (state: typeof mockUseStore) => unknown) => {
    if (selector) {
      return selector(mockUseStore);
    }
    return mockUseStore;
  }
);

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
    required: true,
  },
  {
    type: ElementType.TextAreaField,
    id: "",
    label: "labeled",
    required: true,
  },
  {
    type: ElementType.NumberField,
    id: "",
    label: "number label",
    required: true,
  },
  {
    type: ElementType.Date,
    id: "",
    label: "date label",
    required: true,
    helperText: "can you read this?",
  },
  {
    type: ElementType.Dropdown,
    id: "",
    label: "date label",
    helperText: "can you read this?",
    required: true,
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
    required: true,
    choices: [
      { label: "a", value: "1", checkedChildren: [] },
      { label: "b", value: "2" },
    ],
  },
  {
    type: ElementType.Radio,
    id: "",
    label: "label",
    required: true,
    choices: [
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
  {
    type: ElementType.Divider,
    id: "",
  },
  {
    type: ElementType.StatusAlert,
    id: "",
    text: "mock status",
    status: AlertTypes.ERROR,
  },
  {
    type: ElementType.SubmissionParagraph,
    id: "",
  },
  {
    type: ElementType.SubHeaderMeasure,
    id: "",
  },
];

const textFieldElement: PageElement[] = [
  {
    type: ElementType.Textbox,
    id: "",
    label: "labeled",
    required: true,
  },
  {
    type: ElementType.Radio,
    id: "",
    label: "radio button",
    required: true,
    choices: [
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
    required: true,
  },
];

describe("Page Component with state user", () => {
  test.each(elements)("Renders all element types: %p", (element) => {
    const { container } = render(
      <Page id="mock-page" elements={[element]} setElements={jest.fn()} />
    );
    expect(container).not.toBeEmptyDOMElement();
  });

  test("should render and navigate correctly for ButtonLink element", async () => {
    render(
      <Page
        id="mock-page"
        elements={[
          {
            type: ElementType.ButtonLink,
            id: "",
            to: "report-page-id",
            label: "click me",
          },
        ]}
        setElements={jest.fn()}
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
      <Page
        id="mock-page"
        elements={[badObject as unknown as PageElement]}
        setElements={jest.fn()}
      />
    );
    expect(container).not.toBeEmptyDOMElement();
  });
});

describe("Page Component with read only user", () => {
  beforeEach(() => {
    mockedUseStore.mockReturnValue(mockUseReadOnlyUserStore);
  });
  test("text field and radio button should be disabled", () => {
    render(
      <Page
        id="mock-page"
        elements={textFieldElement}
        setElements={jest.fn()}
      />
    );
    const textField = screen.getByRole("textbox");
    const radioButton = screen.getByLabelText("radio choice 1");
    expect(textField).toBeDisabled();
    expect(radioButton).toBeDisabled();
  });
  test("date field should be disabled", () => {
    render(
      <Page
        id="mock-page"
        elements={dateFieldElement}
        setElements={jest.fn()}
      />
    );
    const dateField = screen.getByRole("textbox");
    expect(dateField).toBeDisabled();
  });
});
