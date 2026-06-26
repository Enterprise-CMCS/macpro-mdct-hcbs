/*
 * The QIP report has three special parts not found in other reports.
 * Together they support custom measure target creation.
 * 1. In this file, the `measureTargetMapping` property.
 *    It contains both technical info (like QMS element IDs)
 *    and presentation info (like user-visible rate names).
 * 2. Also in this file, a special template page.
 *    When a user adds a measure, the template page is cloned & populated.
 *    Some strings within the page contain {variables},
 *    which will change from page to page.
 * 3. A unique element, the QipMeasureTable.
 *    Its `.answer` entries point to `measureTargetMapping` elements.
 *    Together, the answer and the mapping have the data needed
 *    to populate all of the template page's variables.
 */

import {
  AlertTypes,
  ElementType,
  HeaderIcon,
  PageType,
  ReportBase,
  ReportType,
} from "../../../types/reports";
import {
  exportToPDF,
  waiverListCheckboxField,
  waiverListInputField,
} from "../elements";

export const qipReportTemplate: ReportBase = {
  type: ReportType.QIP,
  year: 2026,
  pages: [
    {
      id: "root",
      childPageIds: ["general-info", "select-measures", "review-submit"],
    },
    {
      id: "general-info",
      navTitle: "General Information",
      tabTitle: "General Information - QIP - HCBS",
      type: PageType.Standard,
      sidebar: true,
      elements: [
        {
          type: ElementType.Header,
          id: "general-info-header",
          text: "General Information",
        },
        {
          id: "contact-name",
          type: ElementType.Textbox,
          label: "Contact name",
          required: true,
          helperText:
            "Enter a person's name or a position title for CMS to contact with questions about this report.",
        },
        {
          type: ElementType.Textbox,
          id: "contact-email",
          label: "Contact email address",
          required: true,
          helperText:
            "Enter an email address for the person or position above.  Department or program-wide email addresses are allowed.",
        },
        waiverListCheckboxField,
        waiverListInputField,
      ],
    },
    {
      id: "select-measures",
      navTitle: "Select Measures & Targets",
      tabTitle: "Select Measures & Targets - QIP - HCBS",
      type: PageType.Standard,
      elements: [
        {
          type: ElementType.Header,
          id: "select-measures-header",
          text: "Select Measures & Targets",
        },
        {
          id: "instructions-accordion",
          type: ElementType.Accordion,
          label: "Instructions",
          value:
            "<p>" +
            "  Add the HCBS measures, using the Add Measure button, that are related to this QIP" +
            "  and indicate the baseline value, baseline measurement period, performance target value, and performance target timeframe for each selected measure." +
            "  The performance target timeframe should be within the next reporting period." +
            "</p>" +
            "<p>" +
            "  The baseline value for the LTSS and POM measures " +
            "  can be found in the Quality Measure Set of the Medicaid Data Collection Tool (MDCT)" +
            "  and may be copied over from any submitted QMS report." +
            "</p>" +
            "<p>" +
            "  For MFP grant recipients that report on NCI-IDD, NCI-AD, and/or HCBS CAHPS," +
            "  the baseline value and the performance target values are captured outside of MDCT." +
            "  MFP recipients will need to coordinate internally to input the reported value in this section." +
            "</p>",
        },
        {
          id: "select-measures-table",
          type: ElementType.QipMeasureTable,
          caption: "Selected Measures and Targets",
        },
      ],
    },
    {
      id: "measure-target-template",
      navTitle: "{measureName}", // TODO: measure name is probably too verbose
      tabTitle: "{measureName} - QIP - HCBS", // TODO: measure name is probably too verbose
      type: PageType.Standard,
      elements: [
        {
          type: ElementType.Header,
          id: "page-header",
          text: "{measureName}",
        },
        {
          type: ElementType.Accordion,
          id: "instructions",
          label: "Instructions",
          value: "Placeholder instruction accordion content",
        },
        {
          type: ElementType.SubHeader,
          id: "baseline-header",
          text: "Baseline Rate Values",
          helperText:
            "Please provide the baseline value for each rate tied to this measure",
        },
        {
          // There may be two of these, each with number fields below
          type: ElementType.NestedHeading,
          id: "baseline-{deliveryMethodId}-header",
          text: "{deliveryMethodLabel}", // Ex: "Delivery Method: Fee-For-Service"
        },
        {
          // There may be many of these, depending on the measure and which rates the user selected
          type: ElementType.NumberField,
          id: "baseline-{deliveryMethodId}-{rateId}",
          label: "{rateLabel}", // Ex: "Assessment of Core Elements Rate"
          required: true,
        },
        {
          // TODO: This is MMDDYYYY, but we need MMYYYY.
          type: ElementType.DateRange,
          id: "baseline-period",
          labels: {
            top: "Baseline Measurement Period",
            start: "Baseline Measurement Start",
            end: "Baseline Measurement End",
          },
          helperText:
            "In the baseline measurement period, MFP grant recipients should report the month(s) and year(s) for which the baseline value represents.",
          required: true,
        },
        { type: ElementType.Divider, id: "divider" },
        {
          type: ElementType.SubHeader,
          id: "target-header",
          text: "Performance Target Values",
          helperText:
            "Please enter the specific performance target for each baseline rate reported in the section above." +
            "The target should reflect the rate your state plans to achieve by the end of the next reporting period.",
        },
        {
          // There may be two of these, each with number fields below
          type: ElementType.NestedHeading,
          id: "target-{deliveryMethodId}-header",
          text: "{deliveryMethodLabel}", // Ex: "Delivery Method: Fee-For-Service"
        },
        {
          // There may be many of these, depending on the measure and which rates the user selected
          type: ElementType.NumberField,
          id: "target-{deliveryMethodId}-{rateId}",
          label: "Target rate: {rateLabel}", // Ex: "Target rate: Assessment of Core Elements Rate"
          required: true,
        },
        {
          type: ElementType.NestedHeading,
          id: "target-timeframe-header",
          text: "Performance Target Timeframe",
        },
        {
          // TODO: Our Date component is MMDDYYYY, but this one is supposed to be MMYYYY.
          type: ElementType.Date,
          id: "target-timeframe",
          label: "Target Timeframe",
          // TODO: Per the designs, this helper text should be under the subheader.
          // but our h3 component doesn't have helper text and our date component does.
          helperText:
            "In the baseline measurement period, MFP grant recipients should report the month(s) and year(s) for which the baseline value represents.",
          required: true,
        },
        {
          type: ElementType.TextAreaField,
          id: "notes-on-relevance",
          label: "Notes on Relevance",
          helperText:
            "Provide 1-2 sentences about why this measure was selected.",
          required: false,
        },
      ],
    },
    {
      id: "review-submit",
      navTitle: "Review & Submit",
      tabTitle: "Review & Submit - QIP - HCBS",
      submittedTabTitle: "Successfully Submitted - QIP - HCBS",
      type: PageType.ReviewSubmit,
      sidebar: true,
      hideNavButtons: true,
      elements: [
        {
          type: ElementType.StatusAlert,
          id: "review-alert",
          status: AlertTypes.ERROR,
          title: "Your form is not ready for submission",
          text: "Some sections of the report have errors or are missing required responses. Ensure all required fields are completed with valid responses before submitting.",
        },
        {
          type: ElementType.Header,
          id: "review-header",
          text: "Review & Submit",
        },
        {
          type: ElementType.Paragraph,
          id: "review-text",
          title: "Ready to submit?",
          text: 'Double check that everything in your report is accurate. Once your report is submitted and in "Submitted" status, your report will lock. To make edits after submitting, you will need to contact your CMS HCBS Lead to unlock your report.',
        },
        {
          type: ElementType.Paragraph,
          id: "review-compliance",
          title: "Compliance review",
          text: "Your CMS HCBS Lead will review your report and may contact you and unlock your report for editing if there are corrections to be made.",
        },
        {
          type: ElementType.StatusTable,
          id: "review-status",
          to: "review-submit",
        },
      ],
      submittedView: [
        {
          type: ElementType.Header,
          id: "submitted-header",
          text: "Successfully Submitted",
          icon: HeaderIcon.Check,
        },
        {
          type: ElementType.SubmissionParagraph,
          id: "submitted-thank-you",
        },
        {
          type: ElementType.Divider,
          id: "divider",
        },
        {
          type: ElementType.Paragraph,
          id: "submitted-what-explanation",
          title: "What happens now?",
          text: 'Your dashboard will indicate the status of this report as "Submitted". Your report is now locked from editing.',
        },
        {
          type: ElementType.Paragraph,
          weight: "bold",
          id: "submitted-what-happens",
          text: "Email your CMS representative to inform them that you have submitted the report and it is ready for their review.",
        },
        exportToPDF,
      ],
    },
  ],
  measureTargetMapping: [
    {
      measureName: "LTSS-1: Comprehensive Assessment and Update",
      value: "LTSS-1",
      includedInQms: true,
      // TODO: Should we go directly to the measure result page,
      //       or step through the measure page's `dependentPages[i].template`?
      // deliveryMethods: { FFS: "FFS-1", MLTSS: "MLTSS-1" },
      deliveryMethods: ["FFS", "MLTSS"],
      rates: [
        {
          label: "Performance Rate: Assessment of Core Elements",
          id: "assess-of-core",
          qmsElementId: "measure-rates-assessment",
        },
        {
          label: "Performance Rate: Assessment of Supplemental Elements",
          id: "assess-of-supplemental",
          qmsElementId: "measure-rates-assessment",
        },
        {
          label: "Exclusion Rate: Participant could not be contacted",
          id: "part-not-contact",
          qmsElementId: "measure-rates-exclusion",
        },
        {
          label: "Exclusion Rate: Participant refused assessment",
          id: "part-refuse-assess",
          qmsElementId: "measure-rates-exclusion",
        },
      ],
    },
    {
      measureName: "LTSS-2: Comprehensive Person-Centered Plan and Update",
      value: "LTSS-2",
      includedInQms: true,
      deliveryMethods: ["FFS", "MLTSS"],
      rates: [
        {
          label: "Performance Rate: Person-centered plan with Core Elements",
          id: "person-plan-core",
          qmsElementId: "measure-rates-performance",
        },
        {
          label:
            "Performance Rate: Person-centered plan with Supplementant Elements",
          id: "person-plan-supplemental",
          qmsElementId: "measure-rates-performance",
        },
        {
          label: "Exclusion Rate: Participant could not be contacted",
          id: "part-not-contact",
          qmsElementId: "measure-rates-exclusion",
        },
        {
          label: "Exclusion Rate: Participant refused person-centered-planning",
          id: "part-refuse-planning",
          qmsElementId: "measure-rates-exclusion",
        },
      ],
    },
    {
      measureName: "LTSS-6: Admission to a Facility from the Community",
      value: "LTSS-6",
      includedInQms: true,
      deliveryMethods: ["FFS", "MLTSS"],
      rates: [
        {
          label: "18 to 64 years: Short term stay rate",
          id: "year-1.short-term",
          qmsElementId: "measure-rates",
        },
        {
          label: "18 to 64 years: Medium term stay rate",
          id: "year-2.short-term",
          qmsElementId: "measure-rates",
        },
        {
          label: "18 to 64 years: Long term stay rate",
          id: "year-3.short-term",
          qmsElementId: "measure-rates",
        },
        {
          label: "65 to 74 years: Short term stay rate",
          id: "year-4.short-term",
          qmsElementId: "measure-rates",
        },
        {
          label: "65 to 74 years: Medium term stay rate",
          id: "year-1.med-term",
          qmsElementId: "measure-rates",
        },
        {
          label: "65 to 74 years: Long term stay rate",
          id: "year-2.med-term",
          qmsElementId: "measure-rates",
        },
        {
          label: "75 to 84 years: Short term stay rate",
          id: "year-3.med-term",
          qmsElementId: "measure-rates",
        },
        {
          label: "75 to 84 years: Medium term stay rate",
          id: "year-4.med-term",
          qmsElementId: "measure-rates",
        },
        {
          label: "75 to 84 years: Long term stay rate",
          id: "year-1.long-term",
          qmsElementId: "measure-rates",
        },
        {
          label: "85 year or older: Short term stay rate",
          id: "year-2.long-term",
          qmsElementId: "measure-rates",
        },
        {
          label: "85 year or older: Medium term stay rate",
          id: "year-3.long-term",
          qmsElementId: "measure-rates",
        },
        {
          label: "85 year or older: Long term stay rate",
          id: "year-4.long-term",
          qmsElementId: "measure-rates",
        },
      ],
    },
    {
      measureName: "LTSS-7: Minimizing Facility Length of Stay",
      value: "LTSS-7",
      includedInQms: true,
      deliveryMethods: ["FFS", "MLTSS"],
      rates: [
        {
          label:
            "Observed Performance Rate for Minimizing Length of Facility Stay",
          id: "actualRate",
          qmsElementId: "measure-rates",
        },
        {
          label:
            "Expected Performance Rate for Minimizing Length of Facility Stay",
          id: "expectedRate",
          qmsElementId: "measure-rates",
        },
        {
          label:
            "Risk Adjusted Performance Rate for Minimizing Length of Facility Stay",
          id: "adjustedRate",
          qmsElementId: "measure-rates",
        },
      ],
    },
    {
      measureName:
        "LTSS-8: Successful Transition after Long-Term Facility Stay",
      value: "LTSS-8",
      includedInQms: true,
      deliveryMethods: ["FFS", "MLTSS"],
      rates: [
        {
          label:
            "Observed Performance Rate for Successful Transition after Long-Term Facility Stay",
          id: "actualRate",
          qmsElementId: "measure-rates",
        },
        {
          label:
            "Expected Performance Rate for Successful Transition after Long-Term Facility Stay",
          id: "expectedRate",
          qmsElementId: "measure-rates",
        },
        {
          label:
            "Risk Adjusted Performance Rate for Successful Transition after Long-Term Facility Stay",
          id: "adjustedRate",
          qmsElementId: "measure-rates",
        },
      ],
    },
    {
      measureName: "POM: People Live in Integrated Environments",
      value: "POM-1",
      includedInQms: true,
      deliveryMethods: ["FFS", "MLTSS"],
      rates: [
        {
          label: "Performance Rate",
          id: "measure-rates",
          qmsElementId: "measure-rates",
        },
      ],
    },
    {
      measureName: "POM: People Participate in the Life of the Community",
      value: "POM-2",
      includedInQms: true,
      deliveryMethods: ["FFS", "MLTSS"],
      rates: [
        {
          label: "Performance Rate",
          id: "measure-rates",
          qmsElementId: "measure-rates",
        },
      ],
    },
    {
      measureName: "POM: People Choose Services",
      value: "POM-3",
      includedInQms: true,
      deliveryMethods: ["FFS", "MLTSS"],
      rates: [
        {
          label: "Performance Rate",
          id: "measure-rates",
          qmsElementId: "measure-rates",
        },
      ],
    },
    {
      measureName: "POM: People Realize Personal Goals",
      value: "POM-4",
      includedInQms: true,
      deliveryMethods: ["FFS", "MLTSS"],
      rates: [
        {
          label: "Performance Rate",
          id: "measure-rates",
          qmsElementId: "measure-rates",
        },
      ],
    },
    {
      measureName: "POM: People are Free from Abuse and Neglect",
      value: "POM-5",
      includedInQms: true,
      deliveryMethods: ["FFS", "MLTSS"],
      rates: [
        {
          label: "Performance Rate",
          id: "measure-rates",
          qmsElementId: "measure-rates",
        },
      ],
    },
    {
      measureName: "NCI-IDD PCP-2: Person-Centered Goals",
      value: "PCP-2",
      includedInQms: false,
      deliveryMethods: ["FFS", "MLTSS"],
      rates: [{ label: "Performance Rate", id: "perf-rate" }],
    },
    {
      measureName: "NCI-IDD PCP-5: Satisfaction with Community Inclusion Scale",
      value: "PCP-5",
      includedInQms: false,
      deliveryMethods: ["FFS", "MLTSS"],
      rates: [{ label: "Performance Rate", id: "perf-rate" }],
    },
    {
      measureName: "NCI-IDD CI-1: Social Connectedness",
      value: "CI-1",
      includedInQms: false,
      deliveryMethods: ["FFS", "MLTSS"],
      rates: [{ label: "Performance Rate", id: "perf-rate" }],
    },
    {
      measureName: "NCI-IDD CI-3: Transportation Availability Scale",
      value: "CI-3",
      includedInQms: false,
      deliveryMethods: ["FFS", "MLTSS"],
      rates: [{ label: "Performance Rate", id: "perf-rate" }],
    },
    {
      measureName: "NCI-IDD HLR-1: Respect for Personal Space Scale",
      value: "HLR-1",
      includedInQms: false,
      deliveryMethods: ["FFS", "MLTSS"],
      rates: [{ label: "Performance Rate", id: "perf-rate" }],
    },
    {
      measureName:
        "NCI-AD: Percentage of people who are as active in their community as they would like to be",
      value: "NCIAD-ACTIVE",
      includedInQms: false,
      deliveryMethods: ["FFS", "MLTSS"],
      rates: [{ label: "Performance Rate", id: "perf-rate" }],
    },
    {
      measureName:
        "NCI-AD: Percentage of people whose service plan reflects their preferences and choices",
      value: "NCIAD-PREF",
      includedInQms: false,
      deliveryMethods: ["FFS", "MLTSS"],
      rates: [{ label: "Performance Rate", id: "perf-rate" }],
    },
    {
      measureName:
        "NCI-AD: Percentage of people who feel safe around their support staff",
      value: "NCIAD-SAFE",
      includedInQms: false,
      deliveryMethods: ["FFS", "MLTSS"],
      rates: [{ label: "Performance Rate", id: "perf-rate" }],
    },
    {
      measureName:
        "NCI-AD: Percentage of people who have transportation to get to medical appointments when they need to",
      value: "NCIAD-TRANS-MED",
      includedInQms: false,
      deliveryMethods: ["FFS", "MLTSS"],
      rates: [{ label: "Performance Rate", id: "perf-rate" }],
    },
    {
      measureName:
        "NCI-AD: Percentage of people have transportation when they want to do things outside of their home",
      value: "NICAD-TRANS-OTHER",
      includedInQms: false,
      deliveryMethods: ["FFS", "MLTSS"],
      rates: [{ label: "Performance Rate", id: "perf-rate" }],
    },
    {
      measureName:
        "HCBS-CAHPS: Planning Your Time and Activities Composite Measure",
      value: "CAHPS-PLAN",
      includedInQms: false,
      deliveryMethods: ["FFS", "MLTSS"],
      rates: [{ label: "Performance Rate", id: "perf-rate" }],
    },
    {
      measureName:
        "HCBS-CAHPS: Choosing the Services That Matter To You Composite Measure",
      value: "CAHPS-CHOOSE",
      includedInQms: false,
      deliveryMethods: ["FFS", "MLTSS"],
      rates: [{ label: "Performance Rate", id: "perf-rate" }],
    },
  ],
};
