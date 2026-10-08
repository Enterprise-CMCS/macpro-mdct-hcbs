import { beforeEach, describe, expect, it, vi } from "vitest";
import { mockHelpDeskUser, mockStateUser } from "utils/testing/setupTests";
import { useNavigate, useParams } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import { render, screen, within } from "@testing-library/react";
import {
  CheckboxTemplate,
  ElementType,
  ImaTableTemplate,
  isFormPageTemplate,
  PageElement,
  RadioTemplate,
  Report,
} from "types/report";
import { useStore } from "utils";
import { Page } from "./Page";
import { AlertTypes } from "types";
import { currentPageSelector } from "utils/state/selectors";
import { elementSatisfiesRequired } from "utils/state/reportLogic/completeness";
import { imaReportTemplate } from "../../../../app-api/forms/2028/ima/ima";

vi.mock("react-router-dom", () => ({
  useNavigate: vi.fn(),
  useParams: vi.fn(),
}));

// Mock the more complex elements, let them test themselves
vi.mock("./StatusTable", () => {
  return { StatusTableElement: () => <div>Status Table</div> };
});

const mockNavigate = vi.fn();
vi.mocked(useNavigate).mockReturnValue(mockNavigate);
vi.mocked(useParams).mockReturnValue({
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
    id: "",
    to: "report-page-id",
    label: "click me",
  },
  {
    type: ElementType.QmsMeasureTable,
    id: "",
    measureDisplay: "required",
    caption: "Required Measure Results",
  },
  {
    type: ElementType.QmsMeasureTable,
    id: "",
    measureDisplay: "optional",
    caption: "Optional Measure Results",
  },
  {
    type: ElementType.StatusTable,
    id: "",
    to: "mock-id",
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
    title: "mock alert title",
    text: "mock alert text",
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
  {
    type: ElementType.ReadmissionRate,
    id: "readmission-rate-element",
    required: true,
    labels: {
      stayCount: "Count of Index Hospital Stays",
      obsReadmissionCount: "Count of Observed 30-Day Readmissions",
      obsReadmissionRate: "Observed Readmission Rate",
      expReadmissionCount: "Count of Expected 30-Day readmissions",
      expReadmissionRate: "Expected Readmission Rate",
      obsExpRatio: "Observed-to-Expected Ratio",
      beneficiaryCount: "Count of Beneficiaries in Medicaid Population",
      outlierCount: "Number of Outliers",
      outlierRate: "Outlier Rate",
    },
    hintText: {
      stayCount: "stayCount",
      obsReadmissionCount: "obsReadmissionCount",
      obsReadmissionRate: "obsReadmissionRate",
      expReadmissionCount: "expReadmissionCount",
      expReadmissionRate: "expReadmissionRate",
      obsExpRatio: "obsExpRatio",
      beneficiaryCount: "beneficiaryCount",
      outlierCount: "outlierCount",
      outlierRate: "outlierRate",
    },
  },
  {
    type: ElementType.KeyActivityTable,
    id: "key-activities-table",
    caption: "Key Activities",
    required: true,
    answer: [
      {
        id: "activity-1",
        title: "Activity 1",
        completionDate: "01/2026",
      },
    ],
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

describe("<Page/>", () => {
  describe("with state user", () => {
    beforeEach(() => {
      useStore.setState({ user: mockStateUser });
    });

    it.each(elements)("should render all element types: $type", (element) => {
      const { container } = render(
        <Page id="mock-page" elements={[element]} setElements={vi.fn()} />
      );
      expect(container).not.toBeEmptyDOMElement();
    });

    it("should render and navigate correctly for ButtonLink element", async () => {
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
          setElements={vi.fn()}
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

    it("should not render if it is passed missing types", () => {
      // Page Element prevents us from doing this with typescript, but the real world may have other plans
      const badObject = { type: "unused element name" };

      const { container } = render(
        <Page
          id="mock-page"
          elements={[badObject as unknown as PageElement]}
          setElements={vi.fn()}
        />
      );
      expect(container).not.toBeEmptyDOMElement();
    });

    it("should transmit changes to its parent through setElements", async () => {
      const setElements = vi.fn();
      render(
        <Page
          id="mock-page"
          elements={[
            {
              type: ElementType.Date,
              id: "measurement-period-start-date",
              label: "Measurement start date",
              helperText: "MM/DD/YYYY",
              required: true,
            },
          ]}
          setElements={setElements}
        />
      );

      const dateField = screen.getByRole("textbox");
      await userEvent.type(dateField, "10162024");

      expect(setElements).toHaveBeenLastCalledWith([
        {
          type: ElementType.Date,
          id: "measurement-period-start-date",
          label: "Measurement start date",
          helperText: "MM/DD/YYYY",
          required: true,
          answer: "10/16/2024",
        },
      ]);
    });

    it("should render helper text for NestedHeading element", () => {
      render(
        <Page
          id="mock-page"
          elements={[
            {
              type: ElementType.NestedHeading,
              id: "nested-heading-1",
              text: "Performance Target Timeframe",
              helperText:
                "The performance target timeframe should be within the next reporting period.",
            },
          ]}
          setElements={vi.fn()}
        />
      );

      expect(
        screen.getByText("Performance Target Timeframe")
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          "The performance target timeframe should be within the next reporting period."
        )
      ).toBeInTheDocument();
    });
  });

  describe("with read only user", () => {
    beforeEach(() => {
      useStore.setState({ user: mockHelpDeskUser });
    });

    it("should disabled text fields and radio buttons", () => {
      render(
        <Page
          id="mock-page"
          elements={textFieldElement}
          setElements={vi.fn()}
        />
      );
      const textField = screen.getByRole("textbox");
      const radioButton = screen.getByLabelText("radio choice 1");
      expect(textField).toBeDisabled();
      expect(radioButton).toBeDisabled();
    });

    it("should disable date fields", () => {
      render(
        <Page
          id="mock-page"
          elements={dateFieldElement}
          setElements={vi.fn()}
        />
      );
      const dateField = screen.getByRole("textbox");
      expect(dateField).toBeDisabled();
    });
  });
});

describe("Investigation Referrals page", () => {
  const followUpLabel =
    "Does that state have an interagency information-sharing agreement (e.g. MOU) with any entities?";
  const warningTitle =
    "This incident management system appears to be non-compliant.";

  const getQuestion = () =>
    currentPageSelector(useStore.getState())!.elements!.find(
      (element) => element.id === "investigation-referrals-question"
    ) as RadioTemplate;

  const getFollowUp = () =>
    getQuestion().choices.find((choice) => choice.value === "yes")!
      .checkedChildren![1] as RadioTemplate;

  const getEntities = () =>
    getFollowUp().choices.find((choice) => choice.value === "yes")!
      .checkedChildren![0] as CheckboxTemplate;

  const InvestigationReferralsPage = () => {
    const page = useStore(currentPageSelector)!;
    return (
      <Page
        id={page.id}
        elements={page.elements!}
        setElements={(updatedElements) => {
          const report = useStore.getState().report!;
          useStore.setState({
            report: {
              ...report,
              pages: report.pages.map((reportPage) =>
                isFormPageTemplate(reportPage) && reportPage.id === page.id
                  ? { ...reportPage, elements: updatedElements }
                  : reportPage
              ),
            },
          });
        }}
      />
    );
  };

  beforeEach(() => {
    const report = structuredClone(imaReportTemplate) as unknown as Report;
    useStore.setState({
      user: mockStateUser,
      report,
      pageMap: new Map(report.pages.map((page, index) => [page.id, index])),
      currentPageId: "investigation-referrals",
    });
  });

  it("shows the table and follow-up only when the main answer is Yes", async () => {
    render(<InvestigationReferralsPage />);

    expect(screen.queryByRole("table")).not.toBeInTheDocument();
    expect(screen.queryByText(followUpLabel)).not.toBeInTheDocument();
    expect(screen.queryByText(warningTitle)).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole("radio", { name: "No" }));

    expect(screen.queryByRole("table")).not.toBeInTheDocument();
    expect(screen.queryByText(warningTitle)).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole("radio", { name: "Yes" }));

    expect(screen.getByRole("table")).toBeVisible();
    expect(
      screen.getByRole("radiogroup", { name: followUpLabel })
    ).toBeVisible();
    expect(screen.queryByRole("checkbox")).not.toBeInTheDocument();
    expect(screen.queryByText(warningTitle)).not.toBeInTheDocument();
  });

  it("updates row flags and compliance-dependent fields through the parent radio", async () => {
    render(<InvestigationReferralsPage />);
    await userEvent.click(screen.getByRole("radio", { name: "Yes" }));

    const table = within(screen.getByRole("table"));
    await userEvent.click(
      table.getByRole("radio", {
        name: "Status Only for Provider licensing and/or credentialing",
      })
    );

    expect(screen.getByText(warningTitle)).toBeVisible();
    expect(screen.getByRole("separator")).toBeVisible();
    expect(screen.getByText("Not compliant.")).toBeVisible();
    expect(
      screen.getByRole("textbox", {
        name: "Justification for system noncompliance:",
      })
    ).toBeVisible();
    expect(
      screen.getByRole("textbox", { name: /What actions will the state take/ })
    ).toBeVisible();

    await userEvent.click(
      table.getByRole("radio", {
        name: "Status & Resolution for Adult Protective Services (APS)",
      })
    );

    expect(screen.queryByText(warningTitle)).not.toBeInTheDocument();
    expect(screen.queryByRole("separator")).not.toBeInTheDocument();
    expect(screen.queryByText("Not compliant.")).not.toBeInTheDocument();
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();

    await userEvent.click(
      table.getByRole("radio", {
        name: "No Referral for Adult Protective Services (APS)",
      })
    );

    expect(screen.getByText(warningTitle)).toBeVisible();
    expect(screen.getAllByText("Not compliant.")).toHaveLength(2);
  });

  it("requires entity selections only for follow-up Yes and clears inactive answers", async () => {
    render(<InvestigationReferralsPage />);
    await userEvent.click(screen.getByRole("radio", { name: "Yes" }));

    const pageElements = () =>
      currentPageSelector(useStore.getState())!.elements!;
    expect(elementSatisfiesRequired(getQuestion(), pageElements())).toBe(false);

    const followUp = within(
      screen.getByRole("radiogroup", { name: followUpLabel })
    );
    await userEvent.click(followUp.getByRole("radio", { name: "Yes" }));

    expect(screen.getAllByRole("checkbox")).toHaveLength(10);
    expect(elementSatisfiesRequired(getQuestion(), pageElements())).toBe(false);

    await userEvent.click(
      screen.getByRole("checkbox", { name: "Adult Protective Services (APS)" })
    );
    await userEvent.click(
      screen.getByRole("checkbox", { name: "Child Protective Services (CPS)" })
    );

    expect(getEntities().answer).toEqual([
      "adult-protective-services",
      "child-protective-services",
    ]);
    expect(elementSatisfiesRequired(getQuestion(), pageElements())).toBe(true);

    await userEvent.click(followUp.getByRole("radio", { name: "No" }));

    expect(screen.queryByRole("checkbox")).not.toBeInTheDocument();
    expect(getEntities().answer).toBeUndefined();
    expect(elementSatisfiesRequired(getQuestion(), pageElements())).toBe(true);

    await userEvent.click(followUp.getByRole("radio", { name: "Yes" }));
    expect(
      screen
        .getAllByRole("checkbox")
        .every((checkbox) => !(checkbox as HTMLInputElement).checked)
    ).toBe(true);
    expect(elementSatisfiesRequired(getQuestion(), pageElements())).toBe(false);

    const mainNoAnswer = screen
      .getAllByRole("radio", { name: "No" })
      .find(
        (radio) =>
          radio.getAttribute("name") === "investigation-referrals-question"
      )!;
    await userEvent.click(mainNoAnswer);

    expect(screen.queryByRole("table")).not.toBeInTheDocument();
    expect(screen.queryByText(followUpLabel)).not.toBeInTheDocument();
    expect(getFollowUp().answer).toBeUndefined();
    expect(getEntities().answer).toBeUndefined();
    const table = getQuestion().choices.find(
      (choice) => choice.value === "yes"
    )!.checkedChildren![0] as ImaTableTemplate;
    expect(table.answer).toBeUndefined();
    expect(elementSatisfiesRequired(getQuestion(), pageElements())).toBe(true);
  });

  it("requires justifications only while the referral table is non-compliant", async () => {
    render(<InvestigationReferralsPage />);
    await userEvent.click(screen.getByRole("radio", { name: "Yes" }));
    await userEvent.click(
      within(screen.getByRole("radiogroup", { name: followUpLabel })).getByRole(
        "radio",
        { name: "No" }
      )
    );

    const requiredAnswersAreSatisfied = () => {
      const pageElements = currentPageSelector(useStore.getState())!.elements!;
      return pageElements.every((element) =>
        elementSatisfiesRequired(element, pageElements)
      );
    };
    expect(requiredAnswersAreSatisfied()).toBe(true);

    await userEvent.click(
      screen.getByRole("radio", {
        name: "No Referral for Adult Protective Services (APS)",
      })
    );
    expect(requiredAnswersAreSatisfied()).toBe(false);

    await userEvent.type(
      screen.getByRole("textbox", {
        name: "Justification for system noncompliance:",
      }),
      "Agreement is being revised."
    );
    await userEvent.tab();
    expect(requiredAnswersAreSatisfied()).toBe(false);

    await userEvent.type(
      screen.getByRole("textbox", { name: /What actions will the state take/ }),
      "Complete the revision next quarter."
    );
    await userEvent.tab();
    expect(requiredAnswersAreSatisfied()).toBe(true);

    await userEvent.click(
      screen.getByRole("radio", {
        name: "Status & Resolution for Adult Protective Services (APS)",
      })
    );
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
    expect(requiredAnswersAreSatisfied()).toBe(true);
  });

  it("restores nested table and checkbox answers when the page is reopened", async () => {
    const { unmount } = render(<InvestigationReferralsPage />);
    await userEvent.click(screen.getByRole("radio", { name: "Yes" }));
    await userEvent.click(
      screen.getByRole("radio", {
        name: "Status Only for Provider licensing and/or credentialing",
      })
    );
    await userEvent.click(
      within(screen.getByRole("radiogroup", { name: followUpLabel })).getByRole(
        "radio",
        { name: "Yes" }
      )
    );
    await userEvent.click(
      screen.getByRole("checkbox", {
        name: "Medicaid Fraud Control Unit (MFCU)",
      })
    );

    const savedReport = structuredClone(useStore.getState().report!);
    unmount();
    useStore.setState({ report: savedReport });
    render(<InvestigationReferralsPage />);

    expect(
      screen.getByRole("radio", {
        name: "Status Only for Provider licensing and/or credentialing",
      })
    ).toBeChecked();
    expect(
      screen.getByRole("checkbox", {
        name: "Medicaid Fraud Control Unit (MFCU)",
      })
    ).toBeChecked();
    expect(screen.getByText(warningTitle)).toBeVisible();
    expect(screen.getByText("Not compliant.")).toBeVisible();
  });
});
