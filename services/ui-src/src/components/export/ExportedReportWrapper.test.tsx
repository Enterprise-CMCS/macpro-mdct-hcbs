import { render, screen } from "@testing-library/react";
import { ExportedReportWrapper } from "./ExportedReportWrapper";
import { ElementType, FormPageTemplate, PageElement, PageType } from "types";

const elements: PageElement[] = [
  {
    type: ElementType.Header,
    id: "",
    text: "General Information",
  },
  {
    type: ElementType.Textbox,
    id: "",
    label: "Contact title",
    required: true,
    helperText:
      "Enter person's title or a position title for CMS to contact with questions about this request.",
  },
  {
    type: ElementType.Date,
    id: "",
    label: "Reporting period start date",
    required: true,
    helperText:
      "What is the reporting period Start Date applicable to the measure results?",
  },
  {
    type: ElementType.Textbox,
    id: "",
    label: "Additional comments",
    answer: "",
    required: false,
    helperText: "Enter any additional comments",
  },
];

const section: FormPageTemplate = {
  id: "mock-id",
  title: "mock-title",
  type: PageType.Standard,
  elements: elements,
  sidebar: true,
};

describe("ExportedReportWrapper", () => {
  it("ExportedReportWrapper is visible", () => {
    render(<ExportedReportWrapper section={section}></ExportedReportWrapper>);
    expect(screen.getByText("Contact title")).toBeInTheDocument();
  });

  it("Unanswered optional fields are not rendered", () => {
    render(<ExportedReportWrapper section={section}></ExportedReportWrapper>);
    expect(screen.queryByText("Additional comments")).not.toBeInTheDocument();
  });

  it("should recursively expand checked children", () => {
    const elements: PageElement[] = [
      {
        type: ElementType.Radio,
        id: "banana-preference",
        label: "Do you like bananas?",
        required: true,
        answer: "bananya",
        choices: [
          { label: "No", value: "bananah" },
          {
            label: "Yes, I love bananas",
            value: "bananya",
            checkedChildren: [
              {
                type: ElementType.Radio,
                id: "banana-desire",
                label: "Do you want some bananas?",
                required: true,
                answer: "yes",
                choices: [
                  { label: "I'm good thanks", value: "no" },
                  {
                    label: "Yeah, I'm starving",
                    value: "yes",
                    checkedChildren: [
                      {
                        type: ElementType.TextAreaField,
                        id: "banana-count",
                        label: "Describe your ideal banana",
                        required: true,
                        answer: "Oblong, yellow, not too soft",
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    ];

    render(<ExportedReportWrapper section={{ ...section, elements }} />);

    // All answers should render together in the table
    expect(screen.getAllByRole("table")).toHaveLength(1);
    expect(screen.getByText("Yes, I love bananas")).toBeVisible();
    expect(screen.getByText("Yeah, I'm starving")).toBeVisible();
    expect(screen.getByText("Oblong, yellow, not too soft")).toBeVisible();

    // The choice IDs should not render anywhere
    expect(screen.queryByText("bananah")).not.toBeInTheDocument();
    expect(screen.queryByText("bananya")).not.toBeInTheDocument();
  });
});
