export const testJson = {
  type: "hcbs",
  title: "plan id",
  pages: [
    {
      id: "root",
      children: ["general-info", "req-measure-result", "strat-measure-report"],
    },
    {
      id: "general-info",
      title: "General Information",
      elements: [
        {
          type: "header",
          text: "General Information",
        },
        {
          type: "sub-header",
          text: "State of Program Information",
        },
        {
          type: "textbox",
          label: "Contact title",
          helperText:
            "Enter person's title or a position title for CMS to contact with questions about this request.",
        },
        {
          type: "textbox",
          label: "Contact email address",
          helperText:
            "Enter email address. Department or program-wide email addresses ok.",
        },
        {
          type: "date",
          label: "Reporting period start date",
          helperText:
            "What is the reporting period Start Date applicable to the measure results?",
        },
        {
          type: "date",
          label: "Reporting period end date",
          helperText:
            "What is the reporting period End Date applicable to the measure results?",
        },
      ],
    },
    {
      id: "req-measure-result",
      title: "Required Measure Results",
      elements: [
        {
          type: "header",
          text: "Required Measure Results",
        },
        {
          type: "accordian",
          label: "Instructions",
          value: "I am an accordian",
        },
        {
          type: "resultRowButton",
          value: "{measure}",
          modal: "req-measure-result-modal",
          to: "req-measure-report",
        },
      ],
      children: ["req-measure-report"],
    },
    {
      id: "req-measure-result-modal",
      title:"Select measure",
      type:"modal",
      elements: [
        {
          type: "header",
          text: "Select measure",
        },
        {
          type: "paragraph",
          text: "Select the correct version of the quality measure."
        },
        {
          type: "radio",
          label: "Which quality measure will be reported?",
          value: [
            { label: "{Measure name version 1}", value: "measure-1" },
            { label: "{Measure name version 2}", value: "measure-2" },
          ],
        },
      ],
    },
    {
      id: "req-measure-report",
      title: "Return to Required Measures Results Dashboard",
      sidebar: false,
      elements: [
        {
          type: "button",
          label: "Return to Required Measures Results Dashboard",
          to: "req-measure-result",
        },
        {
          type: "header",
          text: "{measureName}",
        },
        {
          type: "accordian",
          label: "Instructions",
          value: "[Optional instructional content that could support the user in completing this page]",
        },
        {
          type: "sub-header",
          text: "Measure Information",
        },
        {
          type: "textbox",
          label:
            "What is the state performance target for this measure established by the state?",
        },
        {
          type: "radio",
          label: "Is the performance target approved by CMS?",
          value: [
            { label: "Yes", value: "yes" },
            { label: "No", value: "no" },
            { label: "In process", value: "inProcess" },
          ],
        },
      ],
    },
    {
      id: "strat-measure-report",
      title: "Stratified Measure Results",
      elements: [
        {
          type: "header",
          text: "Stratified Measure Results",
        },
        {
          type: "accordian",
          label: "Instructions",
          value: "I am an accordian",
        },
        {
          type: "resultRowButton",
          value: "{measure}",
          modal: "req-measure-result-modal",
          to: "req-measure-report",
        },
      ],
      children: ["req-measure-report"],
    }
  ],
};
