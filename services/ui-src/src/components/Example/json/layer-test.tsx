export const testJson = {
  type: "hcbs",
  name: "plan id",
  pages: [
    {
      id: "root",
      children: ["general-info", "req-measure-list"],
    },
    {
      id: "general-info",
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
          label: "Contact name",
          helperText:
            "Enter person's name or a position title for CMS to contact with questions about this request.",
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
      id: "req-measure-list",
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
          to: "req-measure-report",
        },
      ],
      children: ["req-measure-report"],
    },
    {
      id: "req-measure-report",
      elements: [
        {
          type: "header",
          label: "{measureName}",
        },
        {
          type: "accordian",
          label: "Instructions",
          value: "",
        },
      ],
    },
  ],
};
