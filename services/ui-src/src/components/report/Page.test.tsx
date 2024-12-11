import { render, screen } from "@testing-library/react";
import { ElementType, PageElement } from "types/report";
import { Page } from "./Page";
import {
  mockUseReadOnlyUserStore,
  mockUseStore,
} from "utils/testing/setupJest";
import { useStore } from "utils/state/useStore";

jest.mock("react-router-dom", () => ({
  useNavigate: jest.fn(),
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

const textFieldElement: PageElement[] = [
  {
    type: ElementType.Textbox,
    label: "labeled",
  },
  {
    type: ElementType.Radio,
    label: "radio button",
    value: [{ label: "radio choice 1", value: "1", checkedChildren: [] }],
  },
];

const dateFieldElement: PageElement[] = [
  {
    type: ElementType.Date,
    label: "date label",
    helperText: "can you read this?",
  },
];

describe("Page Component with state user", () => {
  test.each(elements)("Renders all element types: %p", (element) => {
    const { container } = render(<Page elements={[element]} />);
    expect(container).not.toBeEmptyDOMElement();
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
